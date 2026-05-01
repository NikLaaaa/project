import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

export default function Admin() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("dashboard")
  const [feedbacks, setFeedbacks] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        navigate("/")
        return
      }

      setUser(data.session.user)
      fetchFeedback()
      setLoading(false)
    }

    check()
  }, [])

  const fetchFeedback = async () => {
    const { data } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false })

    setFeedbacks(data || [])
  }

  const logout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const deleteFeedback = async (id) => {
    await supabase.from("feedback").delete().eq("id", id)
    setFeedbacks(prev => prev.filter(f => f.id !== id))
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  const today = feedbacks.filter(f =>
    new Date(f.created_at).toDateString() === new Date().toDateString()
  ).length

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-[#e0f7ff] via-[#cfe8f3] to-[#bde3f0]">

      {/* 🌊 BACKGROUND BLOBS */}
      <div className="absolute w-[600px] h-[600px] bg-cyan-300/30 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-300/30 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* 🔲 OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* 📱 SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-[240px] z-50
          bg-white/30 backdrop-blur-2xl border-r border-white/40
          p-6 flex flex-col justify-between
          shadow-[0_8px_32px_rgba(0,0,0,0.08)]
          transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >

        <div>
          <h1 className="text-xl font-semibold mb-10 tracking-tight">
            🐼 Panda Admin
          </h1>

          <div className="flex flex-col gap-2">

            <button
              onClick={() => {
                setTab("dashboard")
                setMenuOpen(false)
              }}
              className={`
                px-4 py-2 rounded-xl text-left transition backdrop-blur-xl
                ${tab === "dashboard"
                  ? "bg-white/60 shadow"
                  : "hover:bg-white/40"}
              `}
            >
              Dashboard
            </button>

            <button
              onClick={() => {
                setTab("feedback")
                setMenuOpen(false)
              }}
              className={`
                px-4 py-2 rounded-xl text-left transition backdrop-blur-xl
                ${tab === "feedback"
                  ? "bg-white/60 shadow"
                  : "hover:bg-white/40"}
              `}
            >
              Feedback
            </button>

          </div>
        </div>

        <button
          onClick={logout}
          className="
            w-full mt-10
            bg-red-500/80 backdrop-blur-xl text-white
            py-2 rounded-xl hover:bg-red-600 transition shadow-md
          "
        >
          Logout
        </button>
      </aside>

      {/* 📦 MAIN */}
      <div className="flex-1 md:ml-[240px] p-6 md:p-10 relative z-10">

        {/* 📱 MOBILE TOP */}
        <div className="flex md:hidden justify-between items-center mb-6">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-2xl"
          >
            ☰
          </button>

          <span className="font-semibold">🐼 Panda</span>

          <button onClick={logout} className="text-red-500">
            ⎋
          </button>
        </div>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div className="space-y-6">

            <h1 className="text-3xl font-semibold tracking-tight text-gray-800">
              Dashboard
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div className="
                bg-white/30 backdrop-blur-2xl border border-white/40
                shadow-[0_8px_32px_rgba(0,0,0,0.08)]
                rounded-2xl p-6 relative overflow-hidden
                transition-all duration-300 hover:scale-[1.02]
              ">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
                <p className="text-gray-500 relative">Всього</p>
                <h2 className="text-3xl font-bold mt-2 text-gray-800 relative">
                  {feedbacks.length}
                </h2>
              </div>

              <div className="
                bg-white/30 backdrop-blur-2xl border border-white/40
                shadow-[0_8px_32px_rgba(0,0,0,0.08)]
                rounded-2xl p-6 relative overflow-hidden
                transition-all duration-300 hover:scale-[1.02]
              ">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
                <p className="text-gray-500 relative">Сьогодні</p>
                <h2 className="text-3xl font-bold mt-2 text-gray-800 relative">
                  {today}
                </h2>
              </div>

            </div>

          </div>
        )}

        {/* FEEDBACK */}
        {tab === "feedback" && (
          <div className="space-y-6">

            <h1 className="text-3xl font-semibold tracking-tight text-gray-800">
              Відгуки
            </h1>

            <div className="space-y-4">
              {feedbacks.map(item => (
                <div
                  key={item.id}
                  className="
                    bg-white/30 backdrop-blur-2xl border border-white/40
                    shadow-[0_8px_32px_rgba(0,0,0,0.08)]
                    rounded-2xl p-5 relative overflow-hidden
                    flex flex-col sm:flex-row sm:justify-between gap-4
                    transition-all duration-300 hover:scale-[1.01]
                  "
                >

                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />

                  <div className="relative">
                    <p className="text-sm text-gray-500">
                      {item.name || "Анонім"}
                    </p>

                    <p className="mt-2 font-medium text-gray-800">
                      💬 {item.review}
                    </p>

                    <p className="text-gray-600 mt-1">
                      🛒 {item.suggestion}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteFeedback(item.id)}
                    className="
                      bg-red-500/80 backdrop-blur-xl text-white
                      px-4 py-2 rounded-xl
                      hover:bg-red-600 transition shadow-md
                      self-start sm:self-center relative
                    "
                  >
                    Видалити
                  </button>

                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}