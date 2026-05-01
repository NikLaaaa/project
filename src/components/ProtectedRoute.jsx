import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // 🔥 получаем текущую сессию
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    // 🔥 слушаем изменения (логин / логаут)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (loading) return <div className="p-10 text-center">Loading...</div>

  // ❌ нет юзера → редирект
  if (!user) return <Navigate to="/" replace />

  // ❌ не твой email
  if (user.email !== "nikita@euro-net.com.ua") {
    return <Navigate to="/" replace />
  }

  // ✅ доступ есть
  return children
}