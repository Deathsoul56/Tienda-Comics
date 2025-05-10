import { useState, useEffect } from 'react';
import { getComics } from '../services/api';

function Catalog() {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const data = await getComics();
        setComics(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los cómics');
        setLoading(false);
        console.error('Error:', err);
      }
    };

    fetchComics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Cargando cómics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-primary-600 mb-6">Catálogo de Comics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {comics.map((comic) => (
          <div key={comic.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 bg-gray-200">
              {comic.imagen ? (
                <img
                  src={comic.imagen}
                  alt={comic.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Sin imagen
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{comic.titulo}</h3>
              <p className="text-gray-600 mb-2">{comic.autor}</p>
              <p className="text-sm text-gray-500 mb-2 line-clamp-2">{comic.descripcion}</p>
              <div className="flex justify-between items-center">
                <p className="text-primary-600 font-bold text-lg">${comic.precio}</p>
                <p className="text-sm text-gray-500">Stock: {comic.stock}</p>
              </div>
              <button 
                className="btn btn-primary w-full mt-4"
                onClick={() => {
                  // Aquí irá la lógica para añadir al carrito
                  console.log('Añadir al carrito:', comic.id);
                }}
              >
                Añadir al Carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalog; 