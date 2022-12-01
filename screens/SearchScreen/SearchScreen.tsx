import { useState } from "react";
import { ActivityIndicator, FlatList, TextInput, Button } from "react-native";
import { Text, View } from "../../components/Themed";
import { useLazyQuery } from "@apollo/client";
import BookItem from "../../components/BookItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchQuery } from "./queries";
import { parseBook } from "../../services/booksService";
import styles from "./styles";

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState<BookProvider>("googleBooksSearch");

  const [runQuery, { data, loading, error }] = useLazyQuery(searchQuery);

  // Purpose of useLazyQuery is to prevent query spamming and only works when it's activated by the user

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {/* SEARCH SECTION */}
      <View style={styles.header}>
        <TextInput
          value={search}
          placeholder="Search..."
          style={styles.input}
          onChangeText={setSearch}
        />
        <Button
          title="Search"
          onPress={() => runQuery({ variables: { q: search } })}
        />
      </View>

      {/* TABS SECTION */}
      <View style={styles.tabs}>
        <Text
          style={
            provider === "googleBooksSearch"
              ? { fontWeight: "bold", color: "royalblue" }
              : {}
          }
          onPress={() => setProvider("googleBooksSearch")}
        >
          Google Books
        </Text>
        <Text
          style={
            provider === "openLibrarySearch"
              ? { fontWeight: "bold", color: "royalblue" }
              : {}
          }
          onPress={() => setProvider("openLibrarySearch")}
        >
          Open Library
        </Text>
      </View>

      {/* Loading Section + Error */}
      {loading && <ActivityIndicator />}
      {error && (
        <>
          <Text>Error Fetching book</Text>
          <Text>{error.message}</Text>
        </>
      )}
      <FlatList
        data={
          (provider === "googleBooksSearch"
            ? data?.googleBooksSearch?.items
            : data?.openLibrarySearch.docs) || []
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <BookItem book={parseBook(item, provider)} />}
      />
    </SafeAreaView>
  );
}
