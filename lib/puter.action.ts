import puter from "@heyputer/puter.js";
import {
  getOrCreateHostingConfig,
  uploadImageToHosting,
} from "./puter.hosting";
import { isHostedUrl } from "./utils";
import { PUTER_WORKER_URL } from "./constants";

export const signIn = async () => await puter.auth.signIn();

export const signOut = () => puter.auth.signOut();

export const getCurrentUser = async () => {
  try {
    return await puter.auth.getUser();
  } catch {
    return null;
  }
};

export const createProject = async ({
  item,
  visibility = "private",
}: CreateProjectParams): Promise<DesignItem | null | undefined> => {
  if (!PUTER_WORKER_URL) {
    console.warn("Missing VITE_PUTER_WORKER_URL; skip history fetch;");
    return null;
  }
  const projectId = item.id;

  const hosting = await getOrCreateHostingConfig();

  const hostedSource = projectId
    ? await uploadImageToHosting({
        hosting,
        url: item.sourceImage,
        projectId,
        label: "source",
      })
    : null;

  const hostedRender =
    projectId && item.renderedImage
      ? await uploadImageToHosting({
          hosting,
          url: item.renderedImage,
          projectId,
          label: "rendered",
        })
      : null;

  const resolvedSource =
    hostedSource?.url ||
    (isHostedUrl(item.sourceImage) ? item.sourceImage : "");

  if (!resolvedSource) {
    console.warn("Failed to host source image, skipping save.");
    return null;
  }

  const resolvedRender = hostedRender?.url
    ? hostedRender?.url
    : item.renderedImage && isHostedUrl(item.renderedImage)
      ? item.renderedImage
      : undefined;

  const {
    sourcePath: _sourcePath,
    renderedPath: _renderedPath,
    publicPath: _publicPath,
    ...rest
  } = item;

  const payload = {
    ...rest,
    sourceImage: resolvedSource,
    renderedImage: resolvedRender,
  };

  try {
    const response = await puter.workers.exec(
      `${PUTER_WORKER_URL}/api/projects/save`,
      {
        method: "POST",
        body: JSON.stringify({
          project: payload,
          visibility,
        }),
      },
    );

    if (!response.ok) {
      console.error("failed to save the project", await response.text());
      return null;
    }

    const data = (await response.json()) as { project?: DesignItem | null };

    return data?.project ?? null;
  } catch (e) {
    console.log("Failed to save project", e);
    return null;
  }
};

export const getProjects = async () => {
  if (!PUTER_WORKER_URL) {
    console.warn("Missing VITE_PUTER_WORKER_URL; skip history fetch;");
    return [];
  }

  try {
    const response = await puter.workers.exec(
      `${PUTER_WORKER_URL}/api/projects/list`,
      { method: "GET" },
    );

    if (!response.ok) {
      console.error("Failed to fetch history", await response.text());
      return [];
    }

    const data = (await response.json()) as { projects?: DesignItem[] | null };

    return Array.isArray(data?.projects) ? data?.projects : [];
  } catch (e) {
    console.error("Failed to get projects", e);
    return [];
  }
};

export const getProjectById = async ({ id }: { id: string }) => {
  if (!PUTER_WORKER_URL) {
    console.warn("Missing VITE_PUTER_WORKER_URL; skipping project fetch.");
    return null;
  }

  try {
    const response = await puter.workers.exec(
      `${PUTER_WORKER_URL}/api/projects/get?id=${encodeURIComponent(id)}`,
      { method: "GET" },
    );

    if (response.ok) {
      const data = (await response.json()) as { project?: DesignItem | null };
      if (data?.project) return data.project;
    }

    const publicResponse = await puter.workers.exec(
      `${PUTER_WORKER_URL}/api/projects/public-get?id=${encodeURIComponent(id)}`,
      { method: "GET" },
    );

    if (!publicResponse.ok) {
      console.error("Failed to fetch project:", await publicResponse.text());
      return null;
    }

    const publicData = (await publicResponse.json()) as {
      project?: DesignItem | null;
    };

    return publicData?.project ?? null;
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
};

export const deleteProject = async (id: string) => {
  if (!PUTER_WORKER_URL) {
    console.warn("Missing VITE_PUTER_WORKER_URL; skip delete;");
    return false;
  }

  try {
    const response = await puter.workers.exec(
      `${PUTER_WORKER_URL}/api/projects/delete?id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );

    if (!response.ok) {
      console.error("Failed to delete project:", await response.text());
      return false;
    }

    return true;
  } catch (e) {
    console.error("Failed to delete project:", e);
    return false;
  }
};

export const shareProject = async (id: string) => {
  if (!PUTER_WORKER_URL) {
    console.warn("Missing VITE_PUTER_WORKER_URL; skip share;");
    return null;
  }

  try {
    const response = await puter.workers.exec(
      `${PUTER_WORKER_URL}/api/projects/share`,
      {
        method: "POST",
        body: JSON.stringify({ id }),
      },
    );

    if (!response.ok) {
      console.error("Failed to share project:", await response.text());
      return null;
    }

    const data = (await response.json()) as { project?: DesignItem | null };
    return data?.project ?? null;
  } catch (e) {
    console.error("Failed to share project:", e);
    return null;
  }
};

export const unshareProject = async (id: string) => {
  if (!PUTER_WORKER_URL) {
    console.warn("Missing VITE_PUTER_WORKER_URL; skip unshare;");
    return null;
  }

  try {
    const response = await puter.workers.exec(
      `${PUTER_WORKER_URL}/api/projects/unshare`,
      {
        method: "POST",
        body: JSON.stringify({ id }),
      },
    );

    if (!response.ok) {
      console.error("Failed to unshare project:", await response.text());
      return null;
    }

    const data = (await response.json()) as { project?: DesignItem | null };
    return data?.project ?? null;
  } catch (e) {
    console.error("Failed to unshare project:", e);
    return null;
  }
};

export const getPublicProjects = async () => {
  if (!PUTER_WORKER_URL) {
    console.warn("Missing VITE_PUTER_WORKER_URL; skip public projects fetch;");
    return [];
  }

  try {
    const response = await puter.workers.exec(
      `${PUTER_WORKER_URL}/api/projects/public-list`,
      { method: "GET" },
    );

    if (!response.ok) {
      console.error("Failed to fetch public projects", await response.text());
      return [];
    }

    const data = (await response.json()) as { projects?: DesignItem[] | null };

    return Array.isArray(data?.projects) ? data?.projects : [];
  } catch (e) {
    console.error("Failed to get public projects", e);
    return [];
  }
};

export const voteOnProject = async (
  projectId: string,
  direction: 1 | -1 | 0,
) => {
  if (!PUTER_WORKER_URL) {
    console.warn("Missing VITE_PUTER_WORKER_URL; skip vote;");
    return null;
  }

  try {
    const response = await puter.workers.exec(
      `${PUTER_WORKER_URL}/api/projects/vote`,
      {
        method: "POST",
        body: JSON.stringify({ projectId, direction }),
      },
    );

    if (!response.ok) {
      console.error("Failed to vote:", await response.text());
      return null;
    }

    return (await response.json()) as { score: number; userVote: number };
  } catch (e) {
    console.error("Failed to vote:", e);
    return null;
  }
};

export const getMyVote = async (projectId: string) => {
  if (!PUTER_WORKER_URL) return 0;

  try {
    const response = await puter.workers.exec(
      `${PUTER_WORKER_URL}/api/projects/my-vote?projectId=${encodeURIComponent(projectId)}`,
      { method: "GET" },
    );

    if (!response.ok) return 0;

    const data = (await response.json()) as { direction: number };
    return data?.direction ?? 0;
  } catch (e) {
    console.error("Failed to get vote:", e);
    return 0;
  }
};

export const getComments = async (
  projectId: string,
): Promise<ProjectComment[]> => {
  if (!PUTER_WORKER_URL) return [];

  try {
    const response = await puter.workers.exec(
      `${PUTER_WORKER_URL}/api/projects/comments?projectId=${encodeURIComponent(projectId)}`,
      { method: "GET" },
    );

    if (!response.ok) return [];

    const data = (await response.json()) as { comments?: ProjectComment[] };
    return Array.isArray(data?.comments) ? data.comments : [];
  } catch (e) {
    console.error("Failed to get comments:", e);
    return [];
  }
};

export const addComment = async ({
  projectId,
  text,
  parentId,
}: {
  projectId: string;
  text: string;
  parentId?: string | null;
}) => {
  if (!PUTER_WORKER_URL) return null;

  try {
    const response = await puter.workers.exec(
      `${PUTER_WORKER_URL}/api/projects/comment`,
      {
        method: "POST",
        body: JSON.stringify({ projectId, text, parentId }),
      },
    );

    if (!response.ok) {
      console.error("Failed to add comment:", await response.text());
      return null;
    }

    const data = (await response.json()) as { comment?: ProjectComment | null };
    return data?.comment ?? null;
  } catch (e) {
    console.error("Failed to add comment:", e);
    return null;
  }
};

export const deleteComment = async (projectId: string, commentId: string) => {
  if (!PUTER_WORKER_URL) return false;

  try {
    const response = await puter.workers.exec(
      `${PUTER_WORKER_URL}/api/projects/comment-delete?projectId=${encodeURIComponent(projectId)}&commentId=${encodeURIComponent(commentId)}`,
      { method: "DELETE" },
    );

    return response.ok;
  } catch (e) {
    console.error("Failed to delete comment:", e);
    return false;
  }
};
