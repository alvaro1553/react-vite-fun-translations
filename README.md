# Welcome to Our UI Engineer Coding Challenge!

A modern, almost production-ready [fun translations](https://funtranslations.com/) client app.
The thing is: you need to finish build it, because the previous line did state it's _almost_ ready ;)

## Assignment

The goal is to bring the app in a working state. It should present a form at `/translate` and when submitting the form, it should show the translation on the same page. It's fairly easy to understand. Now, there are guidelines, otherwise it's too easy, right?

### The guidelines

When developing the app, here are the things to keep in mind:

- The app really wants to be layered (think clean architecture). Pay attention to the important directories (`io`, `view`, `domain`).
- Within `io`, repositories are the low-level stuff and services translate low-level into domain.
- The starting code has a repository for yoda translation.
- The fun translations API is free and open to use, but quite restrictive in term of usage. It's probably a very good idea to start with the provided mock.
- The app will feel much better without any type issue, obviously.

### Extras

Completely the baseline is fine, but this app could be so much more! If you want to _demonstrate_ your skills, there are several things you could add:

- Having multiple engines would make this app so much more useful and enjoyable. Pirates is a classic, but any other is fine.
- A clean git history is always enjoyable for reviewers.
- Writing a caching service to wrap the actual translation service sounds like an idea to mitigate the limited amount of API calls allowed.
- Keeping the past translations somewhere in the _client_ and populating the side menu to go back and look at them would make this app truly amazing.

### Submitting your answer

Once you're ready, because you've invested enough time, or completed all of the extras, please send us your code as a single file. Use the [git archive command](https://graphite.dev/guides/git-archive) to pack the branch on which you worked. You can optionally send some kind of explanation if you think it's needed. Maybe you already left comments in the code for some of that.

That's all, thank you for your effort! We hope you had some fun doing this challenge and that it will be a nice base for discussing technical things with you.

Cheers, the Xayn/Noxtua team.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
