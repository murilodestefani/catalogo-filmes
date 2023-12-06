import { Button, Image } from "@nextui-org/react";
import { Broom, Eye, FilmReel, Popcorn } from "@phosphor-icons/react";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";

function App() {
  interface Movie {
    name: string;
    cover: string;
    synopsis: string;
    classification: number | string;
    premiere: number | string;
  }
  const inputNameRef = useRef<HTMLInputElement>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovie, setNewMovie] = useState<Movie>({
    name: "",
    cover: "",
    synopsis: "",
    classification: "",
    premiere: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const addMovie = useCallback(() => {
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
  }, [movies, newMovie]);

  const deleteMovie = (index: number) => {
    const updatedMovies = [...movies];
    updatedMovies.splice(index, 1);
    setMovies(updatedMovies);
    localStorage.setItem("movie_list", JSON.stringify(updatedMovies));
  };

  const editMovie = (index: number) => {
    inputNameRef.current?.focus();
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

  const totalMovies = useMemo(() => {
    return movies.length;
  }, [movies]);

  return (
    <>
      <main>
        <header className="flex flex-col items-center justify-center gap-2 p-2">
          <div className="logo flex items-center justify-center gap-2">
            {" "}
            <Popcorn size={24} weight="fill" color="yellow" />
            <h1 className="text-2xl font-extrabold ">Catálogo de Filmes</h1>
          </div>

          <h2 className="text-base font-bold text-yellow-300">
            {totalMovies} - Filmes Disponiveis
          </h2>
        </header>

        <section className="flex gap-4">
          {movies.map((movie, index) => (
            <article key={movie} className="flex flex-col gap-2">
              <h3 className="text-center text-lg">{movie.name}</h3>
              <Image
                className="aspect-9/16"
                isZoomed
                width={240}
                alt={movie.name}
                src={movie.cover}
              />
              <Popover placement="right">
                <PopoverTrigger>
                  <Button>Sinopse</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <div className="text-small font-bold">{movie.name}</div>
                    <div className="text-tiny">{movie.synopsis}</div>
                  </div>
                </PopoverContent>
              </Popover>
              <span>{movie.classification}</span>
              <span>{movie.premiere}</span>
              <br />
              <Button
                color="default"
                className="bg-yellow-300 "
                onClick={() => editMovie(index)}
              >
                <span className="text-black">Editar</span>
              </Button>
              <Button
                color="default"
                className="bg-red-600"
                onClick={() => deleteMovie(index)}
              >
                <span className="text-black">Excluir</span>
              </Button>
              <hr />
            </article>
          ))}
        </section>
        <section>
          <h2 className="font-bold text-red-500">
            {editingIndex !== null ? "Editar Filme" : "Cadastrar Filme"}
          </h2>
          <input
            type="text"
            placeholder="Nome do Filme"
            value={newMovie.name}
            onChange={(e) => setNewMovie({ ...newMovie, name: e.target.value })}
            ref={inputNameRef}
          />
          <br></br>
          <input
            type="text"
            placeholder="Link da capa do Filme"
            value={newMovie.cover}
            onChange={(e) =>
              setNewMovie({ ...newMovie, cover: e.target.value })
            }
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
        </section>
      </main>
    </>
  );
}

export default App;
