# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Blog App API - Documentation

## Resources

App Base Url
    - https://blogappapi-6wqv.onrender.com


## regular user

    cream@mail.com
    12345678

## admin user

admin@mail.com
admin123



## Endpoints

### Users

#### [POST] - "/users/register"
Sample Request Body
```json
{
    "email": "sample@mail.com",
    "username": "sampleuser",
    "password": "samplePw123"
}
```

#### [POST] - "/users/login"
Sample Request Body
```json
{
    "email": "sample@mail.com",
    "password": "samplePw123"
}
```

#### [GET] - "/users/details"
Requires token
No Request Body

---

### Blog Posts

#### [POST] - "/posts/addPost"
Requires token
Sample Request Body
```json
{
    "title": "Sample Blog Post",
    "content": "This is a sample blog post."
}
```

#### [GET] - "/posts/getPosts"
No Request Body

#### [GET] - "/posts/getPost/:postId"
No Request Body

#### [PATCH] - "/posts/updatePost/:postId"
Requires token (author or admin)
Sample Request Body
```json
{
    "title": "Updated Title",
    "content": "Updated content."
}
```

#### [DELETE] - "/posts/deletePost/:postId"
Requires token (author or admin)
No Request Body

---

### Comments

#### [POST] - "/posts/addComment/:postId"
Requires token (logged-in user)
Sample Request Body
```json
{
    "content": "This is a comment."
}
```

#### [POST] - "/posts/addGuestComment/:postId"
No token required (guest user)
Sample Request Body
```json
{
    "content": "This is a comment.",
    "username": "GuestName"
}
```

#### [GET] - "/posts/getComments/:postId"
No Request Body

#### [DELETE] - "/posts/deleteComment/:commentId"
Requires token (admin only)
No Request Body

---

## Notes
- All endpoints return JSON responses.
- For protected endpoints, include the JWT token in the `Authorization` header as `Bearer <token>`.
- Only admins can delete any post or comment. Post authors can update or delete their own posts.
- Guests can comment using the guest endpoint; logged-in users use the standard comment endpoint.
