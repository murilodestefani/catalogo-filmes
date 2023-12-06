import {
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar,
  Chip,
  Card,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import {
  FilmReel,
  FilmScript,
  FilmStrip,
  Popcorn,
  Star,
} from "@phosphor-icons/react";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";

function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  interface Movie {
    name: string;
    cover: string;
    synopsis: string;
    rating: number | string;
    premiere: number | string;
  }
  const inputNameRef = useRef<HTMLInputElement>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovie, setNewMovie] = useState<Movie>({
    name: "",
    cover: "",
    synopsis: "",
    rating: "",
    premiere: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const addMovie = useCallback(() => {
    if (
      !newMovie.name ||
      !newMovie.cover ||
      !newMovie.synopsis ||
      !newMovie.rating ||
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
    onOpen();
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
      rating: "",
      premiere: "",
    });
  };

  const totalMovies = useMemo(() => {
    return movies.length;
  }, [movies]);

  return (
    <>
      <Navbar>
        <NavbarBrand
          as={Link}
          href="/"
          color="foreground"
          className="flex items-center justify-center gap-1"
        >
          <FilmReel size={32} weight="duotone" />
          <p className="font-bold text-inherit">Catálogo de Filmes</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button onPress={onOpen} color="primary" variant="flat">
              Cadastrar
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <section className="flex h-screen min-h-screen items-center overflow-x-auto bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
        {movies.map((movie, index) => (
          <div className="mr-4 flex-shrink-0">
            <Card isFooterBlurred className="aspect-9/16 h-96">
              <Image
                removeWrapper
                alt={movie.name}
                className="z-0 h-full w-full -translate-y-6 scale-125 object-cover"
                src={movie.cover}
              />
              <CardFooter className="absolute bottom-0 z-10 justify-between border-t-1 border-zinc-100/50 bg-white/30">
                <div>
                  <p className="text-tiny text-black">Available soon.</p>
                  <p className="text-tiny text-black">Get notified.</p>
                </div>
                <Button
                  className="text-tiny"
                  color="primary"
                  radius="full"
                  size="sm"
                >
                  Detalhes
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </section>
      <div className="flex items-center justify-center py-4">
        <Chip endContent={<Popcorn size={16} weight="fill" />}>
          {totalMovies} Filmes Cadastrados
        </Chip>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        scrollBehavior="inside"
        classNames={{
          base: "text-foreground bg-background dark",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editingIndex !== null ? "Editar Filme" : "Cadastrar Filme"}
              </ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  endContent={
                    <FilmReel className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                  }
                  autoFocus
                  label="Nome"
                  value={newMovie.name}
                  onChange={(e) =>
                    setNewMovie({ ...newMovie, name: e.target.value })
                  }
                  ref={inputNameRef}
                  variant="bordered"
                />

                <Input
                  type="url"
                  endContent={
                    <FilmStrip className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                  }
                  autoFocus
                  label="Capa"
                  value={newMovie.cover}
                  defaultValue="https://source.unsplash.com/random/?cinema"
                  onChange={(e) =>
                    setNewMovie({ ...newMovie, cover: e.target.value })
                  }
                  variant="bordered"
                />
                <Textarea
                  type="text"
                  endContent={
                    <FilmScript className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                  }
                  autoFocus
                  label="Sinopse"
                  value={newMovie.synopsis}
                  onChange={(e) =>
                    setNewMovie({ ...newMovie, synopsis: e.target.value })
                  }
                  variant="bordered"
                />
                <Input
                  type="number"
                  endContent={
                    <Star className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                  }
                  autoFocus
                  label="Avaliação"
                  value={newMovie.rating}
                  onChange={(e) =>
                    setNewMovie({ ...newMovie, rating: e.target.value })
                  }
                  variant="bordered"
                />
                <Input
                  type="number"
                  endContent={
                    <Popcorn className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                  }
                  autoFocus
                  label="Estréia"
                  value={newMovie.premiere}
                  onChange={(e) =>
                    setNewMovie({ ...newMovie, premiere: e.target.value })
                  }
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="solid"
                  onClick={editingIndex !== null ? saveEdit : addMovie}
                >
                  {editingIndex !== null ? "Alterar" : "Cadastrar"}
                </Button>
                <Button
                  color="primary"
                  variant="ghost"
                  onClick={resetMovieForm}
                >
                  Limpar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default App;
