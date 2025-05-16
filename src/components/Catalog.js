import React, { useState, useEffect } from 'react';
import './Catalog.css';

function Catalog() {
    const [comics, setComics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchComics();
    }, []);

    const fetchComics = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/comics');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Error al obtener los cómics');
            }
            const data = await response.json();
            setComics(data);
            setError(null);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="catalog">
            <h2>Catálogo de Cómics</h2>
            {comics.length === 0 ? (
                <p>No hay cómics disponibles</p>
            ) : (
                <div className="comics-grid">
                    {comics.map(comic => (
                        <div key={comic.id} className="comic-card">
                            <img src={comic.imageUrl || "https://via.placeholder.com/200x300"} alt={comic.title} />
                            <h3>{comic.title}</h3>
                            <p>{comic.description}</p>
                            <p className="price">${comic.price}</p>
                            <button className="add-to-cart">Agregar al Carrito</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Catalog; 