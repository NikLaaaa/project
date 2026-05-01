import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import logo from "./assets/logo.png"
import { supabase } from "./lib/supabase"

export default function App() {
  const [name, setName] = useState("")
  const [review, setReview] = useState("")
  const [suggestion, setSuggestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [errors, setErrors] = useState({})
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  // 🔐 LOGIN
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // 🔥 ДОБАВЛЕНО ТОЛЬКО ДЛЯ КНОПКИ
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const [ripples, setRipples] = useState([])

  const handleSubmit = () => {
    const newErrors = {}

    if (!review.trim()) newErrors.review = true
    if (!suggestion.trim()) newErrors.suggestion = true

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      setError(true)
      setTimeout(() => setError(false), 500)
      return
    }

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setSuccess(true)

      setName("")
      setReview("")
      setSuggestion("")
      setErrors({})

      setTimeout(() => setSuccess(false), 2000)
    }, 1200)
  }

  // 💧 ripple
  const createRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const ripple = { id: Date.now(), x, y, size }

    setRipples(prev => [...prev, ripple])

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id))
    }, 600)
  }

const handleLogin = async () => {
  if (!email || !password) {
    setLoginError(true)
    setTimeout(() => setLoginError(false), 500)
    return
  }

  setLoginLoading(true)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  console.log("LOGIN:", data, error)

  setLoginLoading(false)

  if (error) {
    setLoginError(true)
    setTimeout(() => setLoginError(false), 500)
    return
  }




  
  window.location.href = "/admin"
}
  return (
    
    <div
      onMouseMove={(e) => {
        setMouse({
          x: (e.clientX / window.innerWidth - 0.5) * 40,
          y: (e.clientY / window.innerHeight - 0.5) * 40,
        })
      }}
      className="min-h-screen relative overflow-hidden bg-[#cfe8f3]"
    >

      {/* 🔐 LOGIN BUTTON */}
      <div className="absolute top-6 right-6 z-20">
        <motion.button
          whileHover={{ scale: 1.08, y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLogin(true)}
          className="px-5 py-2 rounded-xl bg-white/50 backdrop-blur-md shadow-md text-sm font-medium"
        >
          Login
        </motion.button>
      </div>

      {/* 🌊 ФОН */}
      <motion.div
        animate={{ x: mouse.x, y: mouse.y }}
        className="absolute w-[700px] h-[700px] bg-blue-300/30 blur-[120px] rounded-full"
      />
      <motion.div
        animate={{ x: -mouse.x, y: -mouse.y }}
        className="absolute w-[600px] h-[600px] bg-cyan-200/40 blur-[120px] rounded-full"
      />

      <div className="relative z-10">

        {/* 🐼 ЛОГО */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center mt-10"
        >
          <img src={logo} className="w-28 h-28 rounded-full shadow-xl" />
          <p className="mt-2 text-xs tracking-[0.3em] text-gray-500 uppercase">
            LEARN&DREAM
          </p>
        </motion.div>

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mt-10 px-6"
        >
          <motion.h1
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.05em" }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-semibold tracking-tight"
          >
            Вітаємо!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-xl md:text-2xl leading-relaxed text-gray-700 font-medium"
          >
            Це сторінка відгуків нашого магазинчику, тут ви можете залишити
            відгук про нашу роботу та запропонувати товар
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6 }}
            className="mx-auto mt-10 h-[2px] w-40 bg-gradient-to-r from-transparent via-black/40 to-transparent"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-lg tracking-wide text-gray-600"
          >
            Надішли нам свої побажання
          </motion.p>
        </motion.div>

        {/* FORM */}
        <div className="flex justify-center mt-16 px-6">
          <motion.div
            whileHover={{ rotateX: 2, rotateY: -2 }}
            animate={{
              x: error ? [0, -10, 10, -8, 8, 0] : 0
            }}
            className="w-full max-w-xl p-8 rounded-3xl bg-white/40 backdrop-blur-2xl shadow-xl border border-white/30"
          >

            <div className="space-y-5">

              <Input label="Твоє ім'я (необов'язково)" value={name} setValue={setName} />

              <Input label="Враження від Panda Shop?" value={review} setValue={setReview} isError={errors.review} />

              <Input label="Які товари хочеш бачити?" value={suggestion} setValue={setSuggestion} isError={errors.suggestion} />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="relative w-full py-4 rounded-2xl font-semibold text-white text-lg overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#6fb6e8] to-[#4fd1c5]" />
                <motion.span
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-white/20 blur-xl"
                />
                <span className="relative z-10">
                  {loading ? "..." : "Відправити"}
                </span>
              </motion.button>

            </div>

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-xl rounded-3xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.2 }}
                    className="text-5xl"
                  >
                    ✅
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>

      </div>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50"
          >
            <motion.div
              animate={{
                x: loginError ? [0, -10, 10, -8, 8, 0] : 0
              }}
              className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-sm"
            >

              <h2 className="text-xl font-semibold mb-4 text-center">
                Вхід
              </h2>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 mb-4 rounded-xl bg-white/80 outline-none focus:ring-2 focus:ring-blue-300"
              />

              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 mb-6 rounded-xl bg-white/80 outline-none focus:ring-2 focus:ring-blue-300"
              />

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.07, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogin(false)}
                  className="w-full py-2 rounded-xl bg-gray-200"
                >
                  Закрити
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.07, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    createRipple(e)
                    handleLogin()
                  }}
                  className="relative w-full py-2 rounded-xl text-white bg-gradient-to-r from-[#6fb6e8] to-[#4fd1c5] overflow-hidden flex items-center justify-center"
                >
                  {loginLoading ? (
                    <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : "Увійти"}

                  {ripples.map(r => (
                    <span
                      key={r.id}
                      className="absolute bg-white/40 rounded-full animate-ping"
                      style={{
                        width: r.size,
                        height: r.size,
                        left: r.x,
                        top: r.y
                      }}
                    />
                  ))}
                </motion.button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

function Input({ label, value, setValue, isError }) {
  return (
    <div className="space-y-2 group">
      <p className="text-sm text-gray-600 font-medium">{label}</p>

      <motion.input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Відповідай тут"
        whileFocus={{ scale: 1.02 }}
        className={`
          w-full p-4 rounded-xl bg-white/60 backdrop-blur-md
          shadow-inner outline-none transition-all duration-300
          focus:ring-2 focus:ring-blue-300
          group-hover:shadow-lg
          ${isError ? "ring-2 ring-red-400" : ""}
        `}
      />
    </div>
  )
}