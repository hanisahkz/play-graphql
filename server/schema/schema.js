// Schema for graphql

const graphql = require('graphql');
const _ = require('lodash');

// Destructure to get specific functions from 'graphql'
// GraphQLString is a type String for schema. This declaration is specific to GraphQL
const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;

// todo: Dummmy data. To be removed later
// Book data here must have the author foreign key to demonstrate the book-to-author relationship
const bookList = [
    {id: '1', name: 'The Faraway Tree', genre: 'Fantasy', authorId: '1'},
    {id: '2', name: 'Harry Potter', genre: 'Thriller', authorId: '3'},
    {id: '3', name: 'The Alchemist', genre: 'Fiction', authorId: '3'}
];

const authorList = [
    {id: '1', name: 'JK Rowling', age: '50'},
    {id: '2', name: 'Jodi Picoult', age: '35'},
    {id: '3', name: 'Paul Coelho', age: '44'}
];

// Create schema for Book
// Book belongs to an author
const BookType = new GraphQLObjectType({
    // i) Declare table name. Name is important as it will be used as a reference
    name: 'Book',
    // ii) Declare field names using FUNCTION instead of object, {}.
    // This is related to how code is being read top-to-bottom, hence, throwing "undefined" error because BookType and AuthorType are declaration are interdependent
    // It's a different story if only one depends on the other
    // Using function declaration, it waits until file has been loaded before executing the code. 
    // By doing this, all object needed will already be defined when the program executes.
    fields: () => ({
        //GraphQLID doesn't affect the object's type; it's just for GraphQL query to be flexible enough to be either 'string' or id (integer)
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        // Declare object that's related to Book and its custom type
        // and the function to resolve the query
        author: {
            type: AuthorType,
            resolve(book, args) {
                // console.log('Parent object: ' + parent);
                // console.log('Args object: ' + args);
                return _.find(authorList, {id: book.authorId});
            }
        }
    })
});

// Create schema for Author
// Author has many books
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            // GraphQLList because it's a list of books
            // need to instantiate the GraphQLList object
            type: new GraphQLList(BookType),
            resolve(author, args) {
                // console.log(args);
                // Find in bookList any book with authorId that match the author id
                return _.filter(bookList, {authorId: author.id});
            }
        }
    })
});

// Define a RootQuery and pass an object inside
// can a root query define multiple object type (i.e. not limited to just BookType)
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    // Each field will be a type of Root Query. Root Query can be getting all bookList, all authors, a single book etc.
    fields: {
        // Name of the query. This naming is important. This will be name of GraphQL query
        book: {
            // type of data to be queried
            type: BookType,
            // argument to be passed in GraphQL query
            args: {
                id: {
                    type: GraphQLID
                }
            },
            // resolve function being used to find the data
            resolve(parent, args) {
                // fetch data from database
                // todo: need to get used to reading the API
                //finding book from bookList collection, spinned and coode
                return _.find(bookList, {id: args.id});
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return _.find(authorList, {id: args.id});
            }
        }

    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});