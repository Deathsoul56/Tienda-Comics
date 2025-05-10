-- Agregar ReviewsINSERT INTO Reviews (comic_id, user_id, rating, review_text)
USE Cazuela
INSERT INTO Reviews (comic_id, user_id, rating, review_text)
VALUES (
    63,  -- ID del cómic Jujutsu Kaisen
    1,   -- ID del usuario
    4.5, -- Calificación (de 1 a 5)
    'Jujutsu Kaisen es una serie de manga y anime excepcional. La trama es emocionante y llena de acción, con un sistema de poder bien desarrollado y personajes fascinantes. Gojo Satoru es particularmente carismático. La animación en el anime es impresionante, especialmente en las escenas de combate. Altamente recomendado para los fans del género shonen.'
);


INSERT INTO Reviews (comic_id, user_id, rating, review_text)
VALUES (66, -- ID del manga One Piece
        25, -- ID de otro usuario
        4.1, -- Calificación
        'One Piece es una obra maestra del manga. La historia de Oda es increíblemente rica en detalles, con un worldbuilding excepcional y personajes memorables. La manera en que entrelaza tramas y misterios a lo largo de los años es brillante. Los personajes tienen personalidades únicas y el balance entre comedia y drama es perfecto. Una serie imprescindible.'
);