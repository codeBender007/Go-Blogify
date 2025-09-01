import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const { token, user } = useAuth();

  const load = async () => {
    try {
      const res = await api.get(`/blogs/${id}`, {
        headers: token ? { Authorization: "Bearer " + token } : {},
      });
      setBlog(res.data.blog);
      setLikes(res.data.blog.liked_by?.length || 0);

      if (token && user) {
        setLiked(res.data.blog.liked_by?.includes(user.id) || false);
      } else {
        setLiked(false);
      }

      const commentRes = await api.get(`/blogs/${id}/comments`);
      setComments(commentRes.data.data);
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  const like = async () => {
    if (!token) {
      alert("Please login first");
      return;
    }
    try {
      const res = await api.post(
        `/blogs/${id}/like`,
        {},
        { headers: { Authorization: "Bearer " + token } }
      );
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch (error) {
      console.error("Error while liking:", error);
    }
  };

  useEffect(() => {
    load();
  }, [id, token]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please login first");
    try {
      await api.post(
        `/blogs/${id}/comments`,
        { content: text },
        { headers: { Authorization: "Bearer " + token } }
      );
      setText("");
      load();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!blog)
    return (
      <div className="flex mt-10 justify-center items-center h-40 text-gray-400 text-lg">
        Loading blog details...
      </div>
    );

  return (
    <div className="max-w-5xl mt-16 mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-gray-900 min-h-screen">
      {/* Blog Card */}
      <div className="bg-gray-800 shadow-lg rounded-2xl overflow-hidden border border-gray-700 transition duration-300 hover:shadow-2xl">
        {blog.image_url && (
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <h2 className="text-3xl font-bold text-white leading-tight">
              {blog.title}
            </h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={like}
                disabled={!token}
                className={`px-5 cursor-pointer py-2.5 rounded-lg font-semibold transition-all duration-300 transform active:scale-95 focus:outline-none shadow ${
                  liked
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                } ${!token ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {liked ? "❤️ Liked" : "🤍 Like"}
              </button>

              <span className="bg-gray-700 border border-gray-600 text-gray-200 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                {likes} {likes === 1 ? "Like" : "Likes"}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            By{" "}
            <span className="font-medium text-gray-200">
              {blog.author?.first_name} {blog.author?.last_name}
            </span>{" "}
            • {new Date(blog.created_at).toLocaleDateString()}
          </p>

          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-lg">
            {blog.content}
          </p>

          {user?.id === blog.author_id && (
            <div className="flex gap-4 mt-8">
              <Link
                to={`/edit/${blog.id}`}
                className="bg-blue-600 hover:bg-blue-700  px-5 py-2 rounded-lg shadow transition duration-300"
              >
                <span className="text-white"> ✏️ Edit</span>
              </Link>
              <DeleteButton id={blog.id} />
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-gray-800 shadow-lg rounded-2xl p-8 border border-gray-700 transition duration-300 hover:shadow-2xl">
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          💬 Comments
          <span className="bg-blue-700 text-blue-100 px-3 py-0.5 rounded-full text-sm">
            {comments.length}
          </span>
        </h3>

        {comments.length === 0 ? (
          <p className="text-gray-400 italic">No comments yet. Be the first!</p>
        ) : (
          <div className="space-y-5">
            {comments.map((c) => (
              <div
                key={c.id}
                className="bg-gray-700 rounded-lg p-4 border border-gray-600 shadow-sm transition hover:shadow-md"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-200">
                    {c.user?.first_name} {c.user?.last_name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(c.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {c.content}
                </p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={addComment} className="mt-8 space-y-3">
          <textarea
            rows="3"
            placeholder="Write your comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-gray-200 bg-gray-900 shadow-sm"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow transition-all duration-300">
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
}

function DeleteButton({ id }) {
  const { token } = useAuth();
  const delIt = async () => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete(`/blogs/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };
  return (
    <button
      onClick={delIt}
      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow transition duration-300"
    >
      🗑 Delete
    </button>
  );
}
