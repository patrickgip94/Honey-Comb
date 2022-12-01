import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
} from "react-native";
import { Text, View } from "../components/Themed";
import { gql } from "@apollo/client";
import { useQuery, useLazyQuery } from "@apollo/client/react";
import BookItem from "../components/BookItem";

const query = gql`
  query SearchBooks($q: String) {
    googleBooksSearch(q: $q, country: "US") {
      items {
        id
        volumeInfo {
          authors
          averageRating
          description
          imageLinks {
            thumbnail
          }
          title
          subtitle
          industryIdentifiers {
            identifier
            type
          }
        }
      }
    }
    openLibrarySearch(q: $q) {
      docs {
        author_name
        title
        cover_edition_key
        isbn
      }
    }
  }
`;

export default function TabOneScreen() {
  const [search, setSearch] = useState("");
  const [runQuery, { data, loading, error }] = useLazyQuery(query);

  // Purpose of useLazyQuery is to prevent query spamming and only works when it's activated by the user

  return (
    <View style={styles.container}>
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

      {loading && <ActivityIndicator />}
      {error && (
        <>
          <Text>Error Fetching book</Text>
          <Text>{error.message}</Text>
        </>
      )}
      <FlatList
        data={data?.googleBooksSearch?.items || []}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BookItem
            book={{
              image: item.volumeInfo.imageLinks?.thumbnail,
              title: item.volumeInfo.title,
              authors: item.volumeInfo.authors,
              isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier,
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#F9C901",
    borderRadius: 5,
    padding: 5,
    marginVertical: 5,
  },
});
