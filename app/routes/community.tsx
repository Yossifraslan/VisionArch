import { ArrowUp, ArrowDown, MessageCircle, X, Send, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "../../componens/Navbar";
import Button from "../../componens/ui/Button";
import {
  getPublicProjects,
  voteOnProject,
  getMyVote,
  getComments,
  addComment,
  deleteComment,
  getCurrentUser,
} from "../../lib/puter.action";

const CommentThread = ({
  comment,
  allComments,
  currentUserId,
  onReply,
  onDelete,
}: {
  comment: ProjectComment;
  allComments: ProjectComment[];
  currentUserId: string | null;
  onReply: (parentId: string) => void;
  onDelete: (commentId: string) => void;
}) => {
  const replies = allComments.filter((c) => c.parentId === comment.id);

  return (
    <div className="comment-thread">
      <div className="comment">
        <div className="comment-head">
          <span className="author">{comment.authorUsername}</span>
          <span className="time">
            {new Date(comment.timestamp).toLocaleDateString()}
          </span>
        </div>
        <p className="comment-text">{comment.text}</p>
        <div className="comment-actions">
          <button onClick={() => onReply(comment.id)}>Reply</button>
          {comment.authorId === currentUserId && (
            <button onClick={() => onDelete(comment.id)} className="delete">
              Delete
            </button>
          )}
        </div>
      </div>

      {replies.length > 0 && (
        <div className="comment-replies">
          {replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              allComments={allComments}
              currentUserId={currentUserId}
              onReply={onReply}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Community() {
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser();
      setCurrentUserId(user?.uuid || null);

      const publicProjects = await getPublicProjects();
      publicProjects.sort((a, b) => (b.score || 0) - (a.score || 0));
      setProjects(publicProjects);

      const votes: Record<string, number> = {};
      await Promise.all(
        publicProjects.map(async (p) => {
          votes[p.id] = await getMyVote(p.id);
        }),
      );
      setUserVotes(votes);

      setIsLoading(false);
    };

    init();
  }, []);

  const handleVote = async (projectId: string, direction: 1 | -1) => {
    const currentVote = userVotes[projectId] || 0;
    const newDirection = currentVote === direction ? 0 : direction;

    const result = await voteOnProject(projectId, newDirection);
    if (!result) return;

    setUserVotes((prev) => ({ ...prev, [projectId]: newDirection }));
    setProjects((prev) =>
      prev
        .map((p) => (p.id === projectId ? { ...p, score: result.score } : p))
        .sort((a, b) => (b.score || 0) - (a.score || 0)),
    );
  };

  const openComments = async (projectId: string) => {
    setActiveProjectId(projectId);
    setIsCommentsLoading(true);
    const data = await getComments(projectId);
    setComments(data);
    setIsCommentsLoading(false);
  };

  const closeComments = () => {
    setActiveProjectId(null);
    setComments([]);
    setCommentText("");
    setReplyTo(null);
  };

  const handleSubmitComment = async () => {
    if (!activeProjectId || !commentText.trim()) return;

    const comment = await addComment({
      projectId: activeProjectId,
      text: commentText,
      parentId: replyTo,
    });

    if (comment) {
      setComments((prev) => [...prev, comment]);
      setCommentText("");
      setReplyTo(null);

      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId
            ? { ...p, commentCount: (p.commentCount || 0) + 1 }
            : p,
        ),
      );
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!activeProjectId) return;
    const success = await deleteComment(activeProjectId, commentId);
    if (success) {
      setComments((prev) =>
        prev.filter((c) => c.id !== commentId && c.parentId !== commentId),
      );
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId
            ? { ...p, commentCount: Math.max(0, (p.commentCount || 0) - 1) }
            : p,
        ),
      );
    }
  };

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const topLevelComments = comments.filter((c) => !c.parentId);

  return (
    <div className="community">
      <Navbar />

      <section className="community-hero">
        <h1>Community Designs</h1>
        <p>Browse, vote, and discuss designs shared by everyone.</p>
      </section>

      <section className="community-grid-section">
        {isLoading ? (
          <p className="loading">Loading community designs...</p>
        ) : projects.length === 0 ? (
          <div className="empty">No community designs shared yet. Be the first!</div>
        ) : (
          <div className="community-grid">
            {projects.map((project) => (
              <div key={project.id} className="community-card">
                <div className="preview">
                  <img
                    src={project.renderedImage || project.sourceImage}
                    alt={project.name || "Design"}
                  />
                </div>

                <div className="card-body">
                  <h3>{project.name}</h3>
                  <p className="by">By {project.sharedBy || "Unknown"}</p>

                  <div className="card-actions">
                    <div className="vote-block">
                      <button
                        className={`vote-btn ${userVotes[project.id] === 1 ? "active-up" : ""}`}
                        onClick={() => handleVote(project.id, 1)}
                      >
                        <ArrowUp size={16} />
                      </button>
                      <span className="score">{project.score || 0}</span>
                      <button
                        className={`vote-btn ${userVotes[project.id] === -1 ? "active-down" : ""}`}
                        onClick={() => handleVote(project.id, -1)}
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>

                    <button
                      className="comment-btn"
                      onClick={() => openComments(project.id)}
                    >
                      <MessageCircle size={16} />
                      {project.commentCount || 0}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {activeProjectId && (
        <div className="comments-modal" onClick={closeComments}>
          <div className="comments-panel" onClick={(e) => e.stopPropagation()}>
            <div className="comments-header">
              <h3>{activeProject?.name || "Comments"}</h3>
              <button onClick={closeComments}>
                <X size={20} />
              </button>
            </div>

            <div className="comments-body">
              {isCommentsLoading ? (
                <p className="loading">Loading comments...</p>
              ) : topLevelComments.length === 0 ? (
                <p className="empty-comments">No comments yet. Start the discussion.</p>
              ) : (
                topLevelComments.map((comment) => (
                  <CommentThread
                    key={comment.id}
                    comment={comment}
                    allComments={comments}
                    currentUserId={currentUserId}
                    onReply={setReplyTo}
                    onDelete={handleDeleteComment}
                  />
                ))
              )}
            </div>

            <div className="comments-input">
              {replyTo && (
                <div className="replying-to">
                  Replying to comment
                  <button onClick={() => setReplyTo(null)}>
                    <Trash2 size={12} /> Cancel
                  </button>
                </div>
              )}
              <div className="input-row">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                />
                <Button size="sm" onClick={handleSubmitComment} disabled={!commentText.trim()}>
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}