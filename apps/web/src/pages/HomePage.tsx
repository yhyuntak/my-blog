function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary-600 mb-4">
          히포's Tech Blog
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          React + Vite + TailwindCSS v4 setup completed! 🎉
        </p>
        <div className="space-y-2 text-gray-500">
          <p>Port: 60001</p>
          <p>Backend API: 60000</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
