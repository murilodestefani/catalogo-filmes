import { Button } from "@nextui-org/react";
import { Broom, FilmReel, Popcorn } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

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
    name: "",
    cover: "",
    synopsis: "",
    classification: "",
    premiere: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

      resetMovieForm();

      localStorage.setItem("movie_list", JSON.stringify(MovieList));
    }
  };

  const deleteMovie = (index: number) => {
    const updatedMovies = [...movies];
    updatedMovies.splice(index, 1);
    setMovies(updatedMovies);
    localStorage.setItem("movie_list", JSON.stringify(updatedMovies));
  };

  const editMovie = (index: number) => {
    scroll();
    setEditingIndex(index);
    setNewMovie(movies[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const updatedMovies = [...movies];
      updatedMovies[editingIndex] = newMovie;
      setMovies(updatedMovies);
      setEditingIndex(null);
      resetMovieForm();
      localStorage.setItem("movie_list", JSON.stringify(updatedMovies));
    }
  };

  useEffect(() => {
    if (editingIndex !== null) {
      setNewMovie(movies[editingIndex]);
    }
  }, [editingIndex, movies]);

  useEffect(() => {
    const storedMovies = localStorage.getItem("movie_list");

    if (storedMovies) {
      setMovies(JSON.parse(storedMovies));
    }
  }, []);

  const resetMovieForm = () => {
    setNewMovie({
      name: "",
      cover: "",
      synopsis: "",
      classification: "",
      premiere: "",
    });
  };

  const scroll = () => {
    const targetDiv = document.getElementById("addEditMovie");

    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <FilmReel size={32} />
      <div id="addEditMovie">
        <h2 className="font-bold text-red-500">
          {editingIndex !== null ? "Editar Filme" : "Cadastrar Filme"}
        </h2>
        <input
          type="text"
          placeholder="Nome do Filme"
          value={newMovie.name}
          onChange={(e) => setNewMovie({ ...newMovie, name: e.target.value })}
        />
        <br></br>
        <input
          type="text"
          placeholder="Link da capa do Filme"
          value={newMovie.cover}
          onChange={(e) => setNewMovie({ ...newMovie, cover: e.target.value })}
        />
        <br></br>
        <input
          type="text"
          placeholder="Sinopse do Filme"
          value={newMovie.synopsis}
          onChange={(e) =>
            setNewMovie({ ...newMovie, synopsis: e.target.value })
          }
        />
        <br></br>
        <input
          type="number"
          placeholder="Classificação do Filme"
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
          type="number"
          placeholder="Ano de estréia do Filme"
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

        <Button
          color="default"
          variant="shadow"
          onClick={editingIndex !== null ? saveEdit : addMovie}
        >
          {editingIndex !== null ? "Alterar" : "Cadastrar"}
        </Button>

        <Button color="default" variant="shadow" onClick={resetMovieForm}>
          Limpar
        </Button>
        <hr />
      </div>

      <section>
        {movies.map((movie, index) => (
          <article key={movie}>
            <h6>#{index}</h6>
            <h5>{movie.name}</h5>
            <img src={movie.cover} alt={movie.name} />
            <caption>{movie.synopsis}</caption>
            <span>{movie.classification}</span>
            <span>{movie.premiere}</span>
            <br />
            <button onClick={() => editMovie(index)}>Editar</button>
            <button onClick={() => deleteMovie(index)}>Excluir</button>
            <hr />
          </article>
        ))}
      </section>
    </>
  );
}

export default App;
