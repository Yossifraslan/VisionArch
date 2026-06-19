const PROJECT_PREFIX = "visionArch_project_";
const PUBLIC_PROJECT_PREFIX = "visionArch_public_project_";
const VOTE_PREFIX = "visionArch_vote_";
const COMMENT_PREFIX = "visionArch_comment_";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

const jsonError = (status, message, extra = {}) => {
  return new Response(JSON.stringify({ error: message, ...extra }), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
};

const jsonOk = (data) => {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
};

const getUserId = async (userPuter) => {
  try {
    const user = await userPuter.auth.getUser();
    return user?.uuid || null;
  } catch {
    return null;
  }
};

router.options(
  "/api/projects/save",
  async () => new Response(null, { status: 204, headers: corsHeaders }),
);
router.options(
  "/api/projects/list",
  async () => new Response(null, { status: 204, headers: corsHeaders }),
);
router.options(
  "/api/projects/get",
  async () => new Response(null, { status: 204, headers: corsHeaders }),
);
router.options(
  "/api/projects/delete",
  async () => new Response(null, { status: 204, headers: corsHeaders }),
);
router.options(
  "/api/projects/share",
  async () => new Response(null, { status: 204, headers: corsHeaders }),
);
router.options(
  "/api/projects/unshare",
  async () => new Response(null, { status: 204, headers: corsHeaders }),
);
router.options(
  "/api/projects/public-list",
  async () => new Response(null, { status: 204, headers: corsHeaders }),
);
router.options(
  "/api/projects/public-get",
  async () => new Response(null, { status: 204, headers: corsHeaders }),
);
router.options(
  "/api/projects/vote",
  async () => new Response(null, { status: 204, headers: corsHeaders }),
);
router.options(
  "/api/projects/comments",
  async () => new Response(null, { status: 204, headers: corsHeaders }),
);
router.options(
  "/api/projects/comment",
  async () => new Response(null, { status: 204, headers: corsHeaders }),
);
router.options(
  "/api/projects/comment-delete",
  async () => new Response(null, { status: 204, headers: corsHeaders }),
);

router.post("/api/projects/save", async ({ request, user }) => {
  try {
    const userPuter = user.puter;

    if (!userPuter) return jsonError(401, "Authentication failed");

    const body = await request.json();
    const project = body?.project;

    if (!project?.id || !project?.sourceImage)
      return jsonError(400, "Project ID and source image are required");

    const payload = {
      ...project,
      updatedAt: new Date().toISOString(),
    };

    const userId = await getUserId(userPuter);
    if (!userId) return jsonError(401, "Authentication failed");

    const key = `${PROJECT_PREFIX}${project.id}`;
    await userPuter.kv.set(key, payload);

    return jsonOk({ saved: true, id: project.id, project: payload });
  } catch (e) {
    return jsonError(500, "Failed to save project", {
      message: e.message || "Unknown error",
    });
  }
});

router.get("/api/projects/list", async ({ user }) => {
  try {
    const userPuter = user.puter;
    if (!userPuter) return jsonError(401, "Authentication failed");

    const userId = await getUserId(userPuter);
    if (!userId) return jsonError(401, "Authentication failed");

    const projects = (await userPuter.kv.list(PROJECT_PREFIX, true)).map(
      ({ value }) => ({ ...value, isPublic: false }),
    );

    return jsonOk({ projects });
  } catch (e) {
    return jsonError(500, "Failed to list projects", {
      message: e.message || "Unknown error",
    });
  }
});

router.get("/api/projects/get", async ({ request, user }) => {
  try {
    const userPuter = user.puter;
    if (!userPuter) return jsonError(401, "Authentication failed");

    const userId = await getUserId(userPuter);
    if (!userId) return jsonError(401, "Authentication failed");

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) return jsonError(400, "Project ID is required");

    const key = `${PROJECT_PREFIX}${id}`;
    const project = await userPuter.kv.get(key);

    if (!project) return jsonError(404, "Project not found");

    return jsonOk({ project });
  } catch (e) {
    return jsonError(500, "Failed to get project", {
      message: e.message || "Unknown error",
    });
  }
});

router.get("/api/projects/public-get", async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) return jsonError(400, "Project ID is required");

    const publicKey = `${PUBLIC_PROJECT_PREFIX}${id}`;
    const project = await me.puter.kv.get(publicKey);

    if (!project) return jsonError(404, "Project not found");

    return jsonOk({ project });
  } catch (e) {
    return jsonError(500, "Failed to get public project", {
      message: e.message || "Unknown error",
    });
  }
});

router.delete("/api/projects/delete", async ({ request, user }) => {
  try {
    const userPuter = user.puter;
    if (!userPuter) return jsonError(401, "Authentication failed");

    const userId = await getUserId(userPuter);
    if (!userId) return jsonError(401, "Authentication failed");

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) return jsonError(400, "Project ID is required");

    const key = `${PROJECT_PREFIX}${id}`;
    await userPuter.kv.del(key);

    return jsonOk({ deleted: true, id });
  } catch (e) {
    return jsonError(500, "Failed to delete project", {
      message: e.message || "Unknown error",
    });
  }
});

router.post("/api/projects/share", async ({ request, user }) => {
  try {
    const userPuter = user.puter;
    if (!userPuter) return jsonError(401, "Authentication failed");

    const userId = await getUserId(userPuter);
    if (!userId) return jsonError(401, "Authentication failed");

    const body = await request.json();
    const id = body?.id;
    if (!id) return jsonError(400, "Project ID is required");

    const privateKey = `${PROJECT_PREFIX}${id}`;
    const project = await userPuter.kv.get(privateKey);

    if (!project) return jsonError(404, "Project not found");

    const userInfo = await userPuter.auth.getUser();

    const publicPayload = {
      ...project,
      isPublic: true,
      ownerId: userId,
      sharedBy: userInfo?.username || "Unknown",
      sharedAt: new Date().toISOString(),
      score: 0,
      commentCount: 0,
    };

    const publicKey = `${PUBLIC_PROJECT_PREFIX}${id}`;

    await me.puter.kv.set(publicKey, publicPayload);
    await userPuter.kv.del(privateKey);

    return jsonOk({ shared: true, project: publicPayload });
  } catch (e) {
    return jsonError(500, "Failed to share project", {
      message: e.message || "Unknown error",
    });
  }
});

router.post("/api/projects/unshare", async ({ request, user }) => {
  try {
    const userPuter = user.puter;
    if (!userPuter) return jsonError(401, "Authentication failed");

    const userId = await getUserId(userPuter);
    if (!userId) return jsonError(401, "Authentication failed");

    const body = await request.json();
    const id = body?.id;
    if (!id) return jsonError(400, "Project ID is required");

    const publicKey = `${PUBLIC_PROJECT_PREFIX}${id}`;
    const project = await me.puter.kv.get(publicKey);

    if (!project) return jsonError(404, "Project not found in public storage");

    if (project.ownerId !== userId)
      return jsonError(403, "Not authorized to unshare this project");

    const {
      isPublic: _isPublic,
      sharedBy: _sharedBy,
      sharedAt: _sharedAt,
      score: _score,
      commentCount: _commentCount,
      ...rest
    } = project;

    const privatePayload = { ...rest, isPublic: false };

    const privateKey = `${PROJECT_PREFIX}${id}`;
    await userPuter.kv.set(privateKey, privatePayload);
    await me.puter.kv.del(publicKey);

    return jsonOk({ unshared: true, project: privatePayload });
  } catch (e) {
    return jsonError(500, "Failed to unshare project", {
      message: e.message || "Unknown error",
    });
  }
});

router.get("/api/projects/public-list", async () => {
  try {
    const projects = (await me.puter.kv.list(PUBLIC_PROJECT_PREFIX, true)).map(
      ({ value }) => value,
    );

    return jsonOk({ projects });
  } catch (e) {
    return jsonError(500, "Failed to list public projects", {
      message: e.message || "Unknown error",
    });
  }
});

// VOTING
router.post("/api/projects/vote", async ({ request, user }) => {
  try {
    const userPuter = user.puter;
    if (!userPuter) return jsonError(401, "Authentication failed");

    const userId = await getUserId(userPuter);
    if (!userId) return jsonError(401, "Authentication failed");

    const body = await request.json();
    const { projectId, direction } = body || {};

    if (!projectId || ![1, -1, 0].includes(direction)) {
      return jsonError(
        400,
        "projectId and direction (1, -1, or 0) are required",
      );
    }

    const publicKey = `${PUBLIC_PROJECT_PREFIX}${projectId}`;
    const project = await me.puter.kv.get(publicKey);
    if (!project) return jsonError(404, "Project not found");

    const voteKey = `${VOTE_PREFIX}${projectId}_${userId}`;
    const existingVote = await me.puter.kv.get(voteKey);
    const prevDirection = existingVote?.direction || 0;

    const scoreDelta = direction - prevDirection;
    const newScore = (project.score || 0) + scoreDelta;

    if (direction === 0) {
      await me.puter.kv.del(voteKey);
    } else {
      await me.puter.kv.set(voteKey, { projectId, userId, direction });
    }

    const updatedProject = { ...project, score: newScore };
    await me.puter.kv.set(publicKey, updatedProject);

    return jsonOk({ score: newScore, userVote: direction });
  } catch (e) {
    return jsonError(500, "Failed to vote", {
      message: e.message || "Unknown error",
    });
  }
});

router.get("/api/projects/my-vote", async ({ request, user }) => {
  try {
    const userPuter = user.puter;
    if (!userPuter) return jsonError(401, "Authentication failed");

    const userId = await getUserId(userPuter);
    if (!userId) return jsonError(401, "Authentication failed");

    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");
    if (!projectId) return jsonError(400, "projectId is required");

    const voteKey = `${VOTE_PREFIX}${projectId}_${userId}`;
    const vote = await me.puter.kv.get(voteKey);

    return jsonOk({ direction: vote?.direction || 0 });
  } catch (e) {
    return jsonError(500, "Failed to get vote", {
      message: e.message || "Unknown error",
    });
  }
});

// COMMENTS (threaded via parentId)
router.get("/api/projects/comments", async ({ request }) => {
  try {
    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");
    if (!projectId) return jsonError(400, "projectId is required");

    const prefix = `${COMMENT_PREFIX}${projectId}_`;
    const comments = (await me.puter.kv.list(prefix, true))
      .map(({ value }) => value)
      .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    return jsonOk({ comments });
  } catch (e) {
    return jsonError(500, "Failed to fetch comments", {
      message: e.message || "Unknown error",
    });
  }
});

router.post("/api/projects/comment", async ({ request, user }) => {
  try {
    const userPuter = user.puter;
    if (!userPuter) return jsonError(401, "Authentication failed");

    const userId = await getUserId(userPuter);
    if (!userId) return jsonError(401, "Authentication failed");

    const body = await request.json();
    const { projectId, text, parentId } = body || {};

    if (!projectId || !text?.trim()) {
      return jsonError(400, "projectId and text are required");
    }

    const userInfo = await userPuter.auth.getUser();
    const commentId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const comment = {
      id: commentId,
      projectId,
      parentId: parentId || null,
      text: text.trim(),
      authorId: userId,
      authorUsername: userInfo?.username || "Unknown",
      timestamp: Date.now(),
    };

    const commentKey = `${COMMENT_PREFIX}${projectId}_${commentId}`;
    await me.puter.kv.set(commentKey, comment);

    const publicKey = `${PUBLIC_PROJECT_PREFIX}${projectId}`;
    const project = await me.puter.kv.get(publicKey);
    if (project) {
      await me.puter.kv.set(publicKey, {
        ...project,
        commentCount: (project.commentCount || 0) + 1,
      });
    }

    return jsonOk({ comment });
  } catch (e) {
    return jsonError(500, "Failed to add comment", {
      message: e.message || "Unknown error",
    });
  }
});

router.delete("/api/projects/comment-delete", async ({ request, user }) => {
  try {
    const userPuter = user.puter;
    if (!userPuter) return jsonError(401, "Authentication failed");

    const userId = await getUserId(userPuter);
    if (!userId) return jsonError(401, "Authentication failed");

    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");
    const commentId = url.searchParams.get("commentId");

    if (!projectId || !commentId)
      return jsonError(400, "projectId and commentId are required");

    const commentKey = `${COMMENT_PREFIX}${projectId}_${commentId}`;
    const comment = await me.puter.kv.get(commentKey);

    if (!comment) return jsonError(404, "Comment not found");
    if (comment.authorId !== userId)
      return jsonError(403, "Not authorized to delete this comment");

    await me.puter.kv.del(commentKey);

    const publicKey = `${PUBLIC_PROJECT_PREFIX}${projectId}`;
    const project = await me.puter.kv.get(publicKey);
    if (project) {
      await me.puter.kv.set(publicKey, {
        ...project,
        commentCount: Math.max(0, (project.commentCount || 0) - 1),
      });
    }

    return jsonOk({ deleted: true });
  } catch (e) {
    return jsonError(500, "Failed to delete comment", {
      message: e.message || "Unknown error",
    });
  }
});
