-- 1. __Birthyear__
-- Buscá todas las películas filmadas en el año que naciste.



-- 2. __1982__
-- Cuantas películas hay en la DB que sean del año 1982?

-- 3. __Stacktors__
-- Buscá actores que tengan el substring `stack` en su apellido.

-- 4. __Fame Name Game__
-- Buscá los 10 nombres y apellidos más populares entre los actores. Cuantos actores tienen cada uno de esos nombres y apellidos?
-- Esta consulta puede involucrar múltiples queries.

SELECT first_name, last_name, COUNT(*) as total
FROM actors
GROUP BY LOWER(first_name), LOWER(last_name) ORDER BY total DESC
LIMIT 10;

-- 5. __Prolific__
-- Listá el top 100 de actores más activos junto con el número de roles que haya realizado.

SELECT actors.first_name, actors.last_name, COUNT(*) as total_roles
FROM actors
JOIN roles ON actors.id = roles.actor_id
GROUP BY actors.id ORDER BY total_roles DESC
LIMIT 100;

-- 6. __Bottom of the Barrel__
-- Cuantas películas tiene IMDB por género? Ordená la lista por el género menos popular.

SELECT genre, COUNT(*) as total
FROM movies_genres
GROUP BY genre ORDER BY total;

-- 7. __Braveheart__
-- Listá el nombre y apellido de todos los actores que trabajaron en la película "Braveheart" de 1995, 
-- ordená la lista alfabéticamente por apellido.

SELECT actors.first_name, actors.last_name FROM actors
JOIN roles ON actors.id = roles.actor_id
JOIN movies ON roles.movies_id = movies.id
WHERE movies.name = 'Braveheart' AND movies.year = 1995
ORDER BY actors.last_name;

-- 8. __Leap Noir__
-- Listá todos los directores que dirigieron una película de género 'Film-Noir' en un año bisiesto (para reducir la complejidad, 
-- asumí que cualquier año divisible por cuatro es bisiesto). Tu consulta debería devolver el nombre del director, el nombre de la peli y el año.
-- Todo ordenado por el nombre de la película.

-- DIRECTORS <-- MOVIES_DIRECTORS --> MOVIES <-- MOVIES_GENRES

SELECT directors.first_name, directors.last_name, movies.name, movies.year FROM directors
JOIN movies_directors ON movies_directors.director_id = directors.id
JOIN movies ON movies.id = movies_directors.movie_id
JOIN movies_genres ON movies.id = movies_genres.movie_id
WHERE movies_genres = 'Film-Noir' AND m.year % 4 = 0
ORDER BY movies.name;



-- 9. __° Bacon__
-- Listá todos los actores que hayan trabajado con _Kevin Bacon_ en películas de Drama (incluí el título de la peli). 
-- Excluí al señor Bacon de los resultados.

-- ACTORS -- ROLES  -- MOVIES -- MOVIES_GENRES
-- DISTINCT este comando hace que no se repita el resultado

SELECT DISTINCT actors.first_name, actors.last_name FROM actors
JOIN roles ON actors.id = roles.actor_id
JOIN movies ON roles.movies_id = movies.id
JOIN movies_genres ON movies.id = movies_genres.movie_id
WHERE movies_genres = 'Drama' AND movies.id IN (
-- En esta subquery obtenemos los id movies donde trabajo Kevin Bacon
SELECT movies.id FROM movies
JOIN roles ON movies.id = roles.movie_id
JOIN actors ON roles.actor_id = actors.id
WHERE actors.first_name = 'Kevin' AND actors.last_name = 'Bacon';
)
-- Ahora excluimos a Kevin Bacon de los resultados
AND (actors.first_name || ' ' || actors.last_name != 'Kevin Bacon')
ORDER BY actors.last_name;



-- Índices


-- 10. __Immortal Actors__
-- Qué actores actuaron en una película antes de 1900 y también en una película después del 2000?


-- Con esta subquery obtenemos los id de los actores que acturon antes de 1990
SELECT roles.actor_id FROM roles
JOIN movies ON roles.movie_id = movies.id
WHERE movies.year < 1990;
--

SELECT * FROM actors
WHERE id IN (
SELECT roles.actor_id FROM roles
JOIN movies ON roles.movie_id = movies.id
WHERE movies.year < 1990
) AND id IN (
SELECT roles.actor_id FROM roles
JOIN movies ON roles.movie_id = movies.id
WHERE movies.year > 2000
) LIMIT 20;


-- 11. __Busy Filming__
-- Buscá actores que actuaron en cinco o más roles en la misma película después del año 1990. 
-- Noten que los ROLES pueden tener duplicados ocasionales, sobre los cuales no estamos interesados: 
-- queremos actores que hayan tenido cinco o más roles DISTINTOS (DISTINCT cough cough) en la misma película. 
-- Escribí un query que retorne los nombres del actor, el título de la película y el número de roles (siempre debería ser > 5).

SELECT first_name, last_name, movies.name, COUNT(DISTINCT (role)) as total_roles
WHERE actors 
JOIN roles ON actors.id = roles.actor_id
JOIN movies ON roles.movie_id = movies.id
WHERE movies.year > 1990
GROUP BY actors.id, movies.id 
HAVING total_roles >5;

-- 12. __♀__
-- Para cada año, contá el número de películas en ese años que _sólo_ tuvieron actrices femeninas.


-- subquery para obtener las id de las peliculas que tienen actores MALE para luego no incluirlas.
SELECT roles.movie_id FROM roles
JOIN actors ON roles.actor_id = actors.id
WHERE actors.gender = 'M'

------

SELECT year, COUNT(id) as total
FROM movies
WHERE id NOT IN(
SELECT roles.movie_id FROM roles
JOIN actors ON roles.actor_id = actors.id
WHERE actors.gender = 'M'
)
GROUP BY year;


