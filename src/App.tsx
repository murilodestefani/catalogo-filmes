import { useEffect, useState } from 'react';

function App() {
	interface Movie {
		name: string;
		cover: string;
		synopsis: string;
		classification: number | string;
		premiere: number | string;
	}

	const [movies, setMovies] = useState<Movie[]>([]);
	const [newMovie, setNewMovie] = useState<Movie>({
		name: '',
		cover: '',
		synopsis: '',
		classification: '',
		premiere: '',
	});

	const addMovie = () => {
		if (
			!newMovie.name ||
			!newMovie.cover ||
			!newMovie.synopsis ||
			!newMovie.classification ||
			!newMovie.premiere
		) {
			return;
		} else {
			const MovieList = [newMovie, ...movies];

			setMovies(MovieList);

			setNewMovie({
				name: '',
				cover: '',
				synopsis: '',
				classification: '',
				premiere: '',
			});

			localStorage.setItem('movie_list', JSON.stringify(MovieList));
		}
	};

	useEffect(() => {
		const movies = localStorage.getItem('movie_list');

		if (movies) {
			setMovies(JSON.parse(movies));
		}
	}, []);

	return (
		<div>
			<h1>Catálogo de Filmes</h1>

			<h4>Cadastrar Filme</h4>
			<input
				type='text'
				placeholder='Nome do Filme'
				value={newMovie.name}
				onChange={(e) => setNewMovie({ ...newMovie, name: e.target.value })}
			/>
			<br></br>
			<input
				type='text'
				placeholder='Link da capa do Filme'
				value={newMovie.cover}
				onChange={(e) => setNewMovie({ ...newMovie, cover: e.target.value })}
			/>
			<br></br>
			<input
				type='text'
				placeholder='Sinopse do Filme'
				value={newMovie.synopsis}
				onChange={(e) => setNewMovie({ ...newMovie, synopsis: e.target.value })}
			/>
			<br></br>
			<input
				type='number'
				placeholder='Classificação do Filme'
				value={newMovie.classification}
				onChange={(e) =>
					setNewMovie({
						...newMovie,
						classification: parseInt(e.target.value),
					})
				}
			/>
			<br></br>
			<input
				type='number'
				placeholder='Ano de estréia do Filme'
				value={newMovie.premiere}
				onChange={(e) =>
					setNewMovie({
						...newMovie,
						premiere: parseInt(e.target.value),
					})
				}
			/>
			<br></br>
			<br></br>
			<button onClick={addMovie}>Cadastrar</button>
		</div>
	);
}

export default App;
