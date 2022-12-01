import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type MyBooksContextType = {
  onToggleSaved: (book: Book) => void;
  isBookSaved: (book: Book) => boolean;
  savedBooks: Book[];
};

export const MyBooksContext = createContext<MyBooksContextType>({
  onToggleSaved: () => {},
  isBookSaved: () => false,
  savedBooks: [],
});

type Props = {
  children: ReactNode;
};

const MyBooksProvider = ({ children }: Props) => {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []); // load the data when the components mounts

  useEffect(() => {
    if (loaded) {
      persistData();
    }
  }, [savedBooks]); // persist data everytime it changes

  const areBooksTheSame = (a: Book, b: Book) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  // This function checks if a book is already saved by comparing the two value
  const isBookSaved = (book: Book) => {
    return savedBooks.some((savedBook) => areBooksTheSame(savedBook, book));
  };

  // #1 checks if a book is already saved and also checks if a book is removed from saved
  const onToggleSaved = (book: Book) => {
    if (isBookSaved(book)) {
      // This function filters out the books that are not the same
      setSavedBooks((books) =>
        books.filter((savedBook) => !areBooksTheSame(savedBook, book))
      );
    } else {
      // add to the save book section
      setSavedBooks((books) => [book, ...books]);
    }
  };

  const persistData = async () => {
    // write data to the local storage
    await AsyncStorage.setItem("booksData", JSON.stringify(savedBooks));
  };

  const loadData = async () => {
    // read the data from the local storage
    const dataString = await AsyncStorage.getItem("booksData");
    if (dataString) {
      const items = JSON.parse(dataString);
      setSavedBooks(items);
    }
    setLoaded(true);
  };

  return (
    <MyBooksContext.Provider value={{ onToggleSaved, isBookSaved, savedBooks }}>
      {children}
    </MyBooksContext.Provider>
  );
};

export const useMyBooks = () => useContext(MyBooksContext);

export default MyBooksProvider;
