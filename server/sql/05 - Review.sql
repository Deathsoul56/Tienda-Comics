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

-- taskmaster Hace review de Yu Yu Hakusho
INSERT INTO Reviews (comic_id, user_id, rating, review_text)
VALUES (
    60,  -- ID del cómic Yu Yu Hakusho
    81,  -- ID del usuario
    5.0, -- Calificación (de 1 a 5)
    'Yu Yu Hakusho es un clásico atemporal del shonen. La historia de Yusuke Urameshi, desde su resurrección hasta sus épicas batallas en el Torneo Oscuro, es simplemente inolvidable. Los personajes son entrañables y sus desarrollos a lo largo de la serie son fantásticos. La mezcla de acción, humor y elementos sobrenaturales es perfecta. ¡Una joya que todo fan del manga y anime debería experimentar!'
);

--eternals_makkari reseña Ace of Diamond
INSERT INTO Reviews (comic_id, user_id, rating, review_text)
VALUES (
    99,   -- ID del cómic Ace of Diamond
    98,   -- ID del usuario
    4.2,  -- Calificación (de 1 a 5)
    'Ace of Diamond me ha parecido un manga deportivo muy bien logrado. La pasión por el béisbol se siente en cada página, y el desarrollo de los personajes, especialmente el del protagonista Eijun, es muy interesante de seguir. Las dinámicas dentro del equipo Seido son creíbles y te hacen apoyar sus esfuerzos. Aunque algunas veces el ritmo puede sentirse un poco lento, la dedicación y el espíritu competitivo que transmite la historia son realmente inspiradores.'
);

-- yelena_belova reseña Bleach
INSERT INTO Reviews (comic_id, user_id, rating, review_text)
VALUES (
    67,   -- ID del cómic Bleach
    87,   -- ID del usuario
    4.8,  -- Calificación (de 1 a 5)
    'Bleach es un shonen épico con un mundo rico y fascinante lleno de Soul Reapers, Hollows y batallas espectaculares. La historia de Ichigo Kurosaki y su crecimiento como Shinigami Sustituto es adictiva, y la gran cantidad de personajes memorables, cada uno con sus propias habilidades únicas (¡Bankai!), hace que la serie sea muy entretenida. Aunque el arco argumental final puede ser divisivo, el viaje en general es una montaña rusa de acción y momentos emocionantes. ¡Una lectura obligada para los fans del género!'
);

-- mobius_tva reseña oshi no ko
INSERT INTO Reviews (comic_id, user_id, rating, review_text)
VALUES (
    65,  -- ID del cómic Oshi no Ko
    91,  -- ID del usuario
    5.0, -- Calificación (de 1 a 5)
    'Oshi no Ko es una obra maestra conmovedora y original. La forma en que aborda la industria del entretenimiento y las complejidades de la vida y la muerte es simplemente brillante. Los personajes son increíblemente profundos y sus historias te atrapan desde el principio. La trama te mantiene en vilo con sus giros inesperados. ¡Absolutamente imprescindible!'
);


-- madame_hydra reseña Batman: The Dark Knight Returns
INSERT INTO Reviews (comic_id, user_id, rating, review_text)
VALUES (
    6,   -- ID del cómic Batman: The Dark Knight Returns
    82,  -- ID del usuario
    4.8, -- Calificación (de 1 a 5)
    'Batman: The Dark Knight Returns es una obra cumbre del cómic de superhéroes. Frank Miller redefine al Caballero Oscuro en un futuro distópico de manera magistral. La narrativa es oscura y compleja, explorando temas de envejecimiento, moralidad y el papel de un vigilante en la sociedad. El arte es distintivo y poderoso, contribuyendo a la atmósfera sombría de la historia. Un cómic esencial para cualquier fan de Batman y del medio en general.'
);

-- Spiderman
INSERT INTO Reviews (comic_id, user_id, rating, review_text)
VALUES (
    1,   -- ID del cómic Spiderman
    17,  -- ID del usuario (no es 1 ni 2)
    4.7, -- Calificación
    'Spiderman: El regreso del Duende Verde es una montaña rusa de emociones. La lucha interna de Peter Parker entre su vida personal y su deber como héroe está perfectamente retratada. Los villanos son complejos y la acción nunca decae. El arte es dinámico y los diálogos tienen el toque clásico de humor de Spidey. Una lectura que te atrapa desde la primera página.'
);

INSERT INTO Reviews (comic_id, user_id, rating, review_text)
VALUES (
    1,   -- ID del cómic Spiderman
    34,  -- ID del usuario (no es 1 ni 2)
    4.3, -- Calificación
    'La saga de Spiderman contra Venom es simplemente espectacular. La tensión entre Eddie Brock y Peter Parker añade profundidad a la historia, y las escenas de acción son impresionantes. Me encantó cómo exploran el lado humano de Spiderman y sus dilemas morales. Sin duda, uno de los mejores arcos del personaje.'
);

-- john_doe reseña The Amazing Spider-Man
INSERT INTO Reviews (comic_id, user_id, rating, review_text)
VALUES (
    1,   -- ID del cómic The Amazing Spider-Man
    1,   -- ID del usuario (john_doe)
    5.0, -- Calificación (de 1 a 5)
    '¡Increíble inicio para Spiderman! The Amazing Spider-Man captura perfectamente la esencia de Peter Parker y su lucha diaria. Stan Lee hizo un trabajo maravilloso introduciendo al personaje, me encantó leer sobre sus orígenes y cómo combina la acción con problemas adolescentes comunes.'
);

-- mystique_blue reseña Maus
INSERT INTO Reviews (comic_id, user_id, rating, review_text)
VALUES (
    3,   -- ID del cómic Maus
    23,  -- ID del usuario (mystique_blue)
    4.9, -- Calificación (de 1 a 5)
    'Maus es una obra que te rompe el corazón pero es absolutamente necesaria. Art Spiegelman relata la historia de una manera cruda y a la vez profundamente artística. La metáfora de los animales funciona a la perfección y te hace reflexionar sobre la naturaleza humana y la historia. Un cómic brillante.'
);

-- tony_stark reseña Saga
INSERT INTO Reviews (comic_id, user_id, rating, review_text)
VALUES (
    5,   -- ID del cómic Saga
    7,   -- ID del usuario (tony_stark)
    4.8, -- Calificación (de 1 a 5)
    'Saga es, sin duda, una de las mejores óperas espaciales que he leído. Fiona Staples hace un trabajo artístico espectacular, y la historia de Brian K. Vaughan te atrapa desde las primeras páginas. Los personajes son sumamente complejos y no puedes evitar encariñarte con ellos, a pesar del universo caótico en el que viven.'
);

-- jane_smith reseña Transmetropolitan
INSERT INTO Reviews (comic_id, user_id, rating, review_text)
VALUES (
    12,  -- ID del cómic Transmetropolitan
    2,   -- ID del usuario (jane_smith)
    5.0, -- Calificación
    'Transmetropolitan es una genialidad del ciberpunk. Spider Jerusalem es un protagonista amoral, caótico y a la vez el único que dice la verdad en un futuro distópico que se siente aterradoramente real. Warren Ellis construye un mundo fascinante lleno de crítica social.'
);

-- wonderwoman84 reseña Sandman
INSERT INTO Reviews (comic_id, user_id, rating, review_text)
VALUES (
    7,   -- ID del cómic Sandman
    5,   -- ID del usuario (wonderwoman84)
    4.9, -- Calificación
    'Pocas obras logran lo que Neil Gaiman ha hecho con Sandman. Es poesía convertida en viñetas. La forma en que mezcla la mitología, los sueños y temas filosóficos es brillante. Morfeo es un personaje cautivador y el arte acompaña cada arco de historia de manera sublime.'
);

-- batman_fan reseña Persepolis
INSERT INTO Reviews (comic_id, user_id, rating, review_text)
VALUES (
    4,   -- ID del cómic Persepolis
    3,   -- ID del usuario (batman_fan)
    4.7, -- Calificación
    'Persepolis es una obra autobiográfica profundamente conmovedora. Marjane Satrapi logra transmitir la dureza de la revolución iraní y la guerra a través de los ojos de una niña que crece. Su estilo en blanco y negro es simple pero comunica mucho. Me abrió los ojos a otra realidad.'
);