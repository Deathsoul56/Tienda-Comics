function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary-600 mb-6">
        Bienvenido a ComicStore
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Tu tienda de cómics favorita con las mejores historias y colecciones
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Nuevos Lanzamientos</h2>
          <p className="text-gray-600">Descubre las últimas novedades en cómics</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Colecciones</h2>
          <p className="text-gray-600">Explora nuestras colecciones completas</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Ofertas Especiales</h2>
          <p className="text-gray-600">Aprovecha nuestras promociones exclusivas</p>
        </div>
      </div>
    </div>
  )
}

export default Home 