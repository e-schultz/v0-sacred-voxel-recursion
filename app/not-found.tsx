export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-4 text-cyan-400">404 - Page Not Found</h1>
      <p className="text-xl mb-8">The sacred geometry you seek does not exist in this dimension.</p>
      <a href="/" className="px-4 py-2 bg-magenta-500 text-white rounded hover:bg-magenta-400 transition-colors">
        Return to Sacred Space
      </a>
    </div>
  )
}
