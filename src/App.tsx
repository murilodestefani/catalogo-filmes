import {
  Image,
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
  PopoverContent,
  PopoverTrigger,
  Popover,
  Avatar,
  AvatarGroup,
} from "@nextui-org/react";
import {
  FilmReel,
  FilmScript,
  FilmSlate,
  FilmStrip,
  PencilSimple,
  Popcorn,
  Star,
  TrashSimple,
} from "@phosphor-icons/react";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";

function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  interface Movie {
    name: string;
    cover: string;
    synopsis: string;
    rating: number | null;
    premiere: number | null;
  }
  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputCoverRef = useRef<HTMLInputElement>(null);
  const inputSynopsisRef = useRef<HTMLTextAreaElement>(null);
  const inputRatingRef = useRef<HTMLInputElement>(null);
  const inputPremiereRef = useRef<HTMLInputElement>(null);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovie, setNewMovie] = useState<Movie>({
    name: "",
    cover: "https://source.unsplash.com/random/?movie",
    synopsis: "",
    rating: null,
    premiere: null,
  });

  const addMovie = useCallback(() => {
    if (
      !newMovie.name ||
      !newMovie.cover ||
      !newMovie.synopsis ||
      !newMovie.rating ||
      !newMovie.premiere
    ) {
      alert("Um ou mais campos estão vazios!");
      return;
    } else {
      onOpen;
      inputNameRef.current?.focus();
      const MovieList = [newMovie, ...movies];
      setMovies(MovieList);
      localStorage.setItem("movie_list", JSON.stringify(MovieList));
      resetMovieForm();
    }
  }, [movies, newMovie, onOpen]);

  const deleteMovie = (index: number) => {
    const updatedMovies = [...movies];
    updatedMovies.splice(index, 1);
    setMovies(updatedMovies);
    localStorage.setItem("movie_list", JSON.stringify(updatedMovies));
  };

  const editMovie = (index: number) => {
    onOpen();
    inputNameRef.current?.focus();
    setEditingIndex(index);
    setNewMovie(movies[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const updatedMovies = [...movies];
      updatedMovies[editingIndex] = newMovie;
      setMovies(updatedMovies);
      setEditingIndex(null);
      localStorage.setItem("movie_list", JSON.stringify(updatedMovies));
      resetMovieForm();
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
      cover: "https://source.unsplash.com/random/?movie",
      synopsis: "",
      rating: null,
      premiere: null,
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
          className="flex items-center justify-center gap-1"
        >
          <FilmReel size={32} weight="duotone" color="#facc15" />
          <p className="font-bold text-foreground">Catálogo de Filmes</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700"
              onPress={onOpen}
              color="default"
              variant="shadow"
            >
              <span className="text-black">Cadastrar</span>
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div className="flex items-center justify-center py-4">
        <Chip endContent={<Popcorn size={16} weight="fill" />}>
          {totalMovies} Filmes Cadastrados
        </Chip>
      </div>

      <section className="flex h-screen items-center overflow-x-auto bg-gradient-to-br from-gray-700 via-gray-900 to-black p-4">
        {movies.map((movie, index) => (
          <div className="mr-8 flex flex-shrink-0 flex-col items-center gap-2">
            <Popover placement="bottom" showArrow={true}>
              <PopoverTrigger>
                <Card isFooterBlurred className="aspect-9/16 h-96">
                  <Image
                    removeWrapper
                    alt={movie.name}
                    className="z-0 h-full w-full -translate-y-6 scale-125 object-cover"
                    src={movie.cover}
                  />
                  <CardFooter className="absolute bottom-0 z-10 border-t-1 border-zinc-100/50 bg-white/30">
                    <h2 className="text-tiny font-bold text-yellow-400">
                      #{index + 1} {movie.name}
                    </h2>
                  </CardFooter>
                </Card>
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2">
                  <header className="text-small font-bold">
                    <h2 className="text-center">{movie.name}</h2>
                  </header>
                  <body>
                    <p className="text-tiny italic">
                      <strong>Sinopse: </strong>
                      {movie.synopsis}
                    </p>
                    <div className="my-4 flex flex-col items-center justify-between gap-2">
                      <Chip
                        startContent={<Star weight="duotone" />}
                        variant="solid"
                        color="default"
                      >
                        <span className="font-bold">Nota: </span>
                        <span>{movie.rating}</span>
                      </Chip>
                      <Chip
                        startContent={<FilmSlate weight="duotone" />}
                        variant="solid"
                        color="default"
                      >
                        <span className="font-bold">Estréia: </span>
                        <span>{movie.premiere}</span>
                      </Chip>
                    </div>
                  </body>
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex gap-2">
              <Button
                startContent={<PencilSimple weight="fill" />}
                onClick={() => editMovie(index)}
                color="default"
                variant="solid"
              >
                Editar
              </Button>
              <Button
                startContent={<TrashSimple weight="fill" />}
                onClick={() => deleteMovie(index)}
                color="default"
                variant="bordered"
              >
                Excluir
              </Button>
            </div>
          </div>
        ))}
      </section>

      <Modal
        size="sm"
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
                  description="Nome do Filme"
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
                  label="Capa"
                  description="Url da imagem da Capa"
                  value={newMovie.cover}
                  onChange={(e) =>
                    setNewMovie({ ...newMovie, cover: e.target.value })
                  }
                  ref={inputCoverRef}
                  variant="bordered"
                />
                <Textarea
                  type="text"
                  endContent={
                    <FilmScript className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                  }
                  label="Sinopse"
                  description="Texto da Sinopse"
                  value={newMovie.synopsis}
                  onChange={(e) =>
                    setNewMovie({ ...newMovie, synopsis: e.target.value })
                  }
                  ref={inputSynopsisRef}
                  variant="bordered"
                />
                <Input
                  type="number"
                  min={0}
                  max={10}
                  endContent={
                    <Star className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                  }
                  label="Avaliação"
                  description="Nota de 0 à 10"
                  value={String(newMovie.rating)}
                  onChange={(e) =>
                    setNewMovie({
                      ...newMovie,
                      rating: parseInt(e.target.value),
                    })
                  }
                  ref={inputRatingRef}
                  variant="bordered"
                />
                <Input
                  type="number"
                  min={1900}
                  max={2100}
                  endContent={
                    <Popcorn className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                  }
                  label="Estréia"
                  description="Ano de estréia"
                  value={String(newMovie.premiere)}
                  onChange={(e) =>
                    setNewMovie({
                      ...newMovie,
                      premiere: parseInt(e.target.value),
                    })
                  }
                  ref={inputPremiereRef}
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700"
                  color="primary"
                  variant="solid"
                  onClick={editingIndex !== null ? saveEdit : addMovie}
                >
                  <p className="text-black">
                    {editingIndex !== null ? "Alterar" : "Cadastrar"}
                  </p>
                </Button>
                <Button
                  className="border-yellow-400 hover:bg-yellow-600"
                  color="default"
                  variant="bordered"
                  onClick={resetMovieForm}
                >
                  <p className="text-yellow-400">Limpar</p>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <footer className="container flex flex-col items-center justify-center gap-2 p-4">
        <img
          className="w-32"
          src="/IFMS-NA.png"
          alt="IFMS
Instituto Federal de Mato Grosso do Sul"
        />
        <span className="font-bold">Frameworks 1</span>
        <div className="flex items-center justify-center gap-3">
          <span className="italic">Desenvolvido por</span>
          <AvatarGroup isBordered>
            <Avatar size="sm" isBordered color="warning" src="/Murilo.png" />
            <Avatar size="sm" isBordered color="warning" src="/Gustavo.png" />
          </AvatarGroup>
        </div>
      </footer>
    </>
  );
}

export default App;
