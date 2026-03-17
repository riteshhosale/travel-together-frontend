import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";

function Feed() {
  const [searchParams] = useSearchParams();
  const featureName = searchParams.get("feature") || "Community Feed";
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadFeed = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await API.get("/feed");
      setPosts(res.data);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to load feed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const createPost = async () => {
    if (!image && !imageFile && !caption) {
      alert("Please add an image file, image URL, or caption.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("caption", caption);

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      if (image) {
        formData.append("image", image);
      }

      const res = await API.post("/feed", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPosts((prev) => [res.data, ...prev]);
      setCaption("");
      setImage("");
      setImageFile(null);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to post";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fg-page min-h-screen px-4 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
            {featureName}
          </p>
          <h2 className="fg-title mt-3 text-3xl font-bold">{featureName}</h2>
          <p className="fg-muted mt-2 text-sm">
            Share snapshots and tips from your travels.
          </p>
        </div>

        <div className="fg-glass mb-8 rounded-3xl p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="fg-muted text-xs font-semibold">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  setImageFile(file || null);
                }}
                className="fg-input mt-2 text-sm"
              />
            </div>
            <div>
              <label className="fg-muted text-xs font-semibold">
                Image URL
              </label>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="fg-input mt-2 text-sm"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="fg-muted text-xs font-semibold">Caption</label>
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What did you discover?"
                className="fg-input mt-2 text-sm"
              />
            </div>
          </div>

          <button
            onClick={createPost}
            disabled={isSubmitting}
            className="fg-btn-primary mt-4 text-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Posting..." : "Post update"}
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-300/60 bg-rose-100/70 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={`feed-loading-${index}`}
                className="fg-glass rounded-2xl p-6"
              >
                <div className="h-40 w-full rounded-xl bg-slate-100" />
                <div className="mt-4 h-4 w-3/4 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="fg-glass rounded-2xl border-dashed p-8 text-center text-sm fg-muted">
            No posts yet. Share the first update.
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="fg-glass rounded-2xl p-6">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.caption || "Travel update"}
                    className="h-64 w-full rounded-xl object-cover"
                  />
                )}
                <div className="mt-4">
                  <p className="fg-title text-sm font-semibold">
                    {post.user?.name || "Traveler"}
                  </p>
                  <p className="fg-muted mt-2 text-sm">
                    {post.caption || "Shared a travel update."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
