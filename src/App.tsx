import { FormEvent, useEffect, useState } from "react";
import { fetchImages } from "./api";

function Header() {
  return (
    <header className="hero is-dark is-bold">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">Cute Dog Images</h1>
        </div>
      </div>
    </header>
  );
}

function Image(props: { src: string }) {
  return (
    <div className="card">
      <div className="card-image">
        <figure>
          <img src={props.src} alt="cute dog" />
        </figure>
      </div>
    </div>
  );
}

function Loading() {
  return <p>Loading...</p>;
}

function Gallery(props: { urls: string[] | null }) {
  const { urls } = props;
  if (urls === null) {
    return <Loading />;
  }
  return (
    <div className="columns is-vcentered is-multiline">
      {urls.map((url) => {
        return (
          <div key={url} className="column is-3">
            <Image src={url} />
          </div>
        );
      })}
    </div>
  );
}

type FormProps = {
  onFormSubmit: (breed: string) => void;
};

function Form(props: FormProps) {
  const [breed, setBreed] = useState("shiba")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    props.onFormSubmit(breed);
  }
  return (
    <div>
      <form onSubmit={event => {handleSubmit(event)}}>
        <div className="field has-addons">
          <div className="control is-expanded">
            <div className="select is-fullwidth">
              <select name="breed" value={breed} onChange={(event) => setBreed(event.target.value)}>
                <option value="shiba">Shiba</option>
                <option value="akita">Akita</option>
              </select>
            </div>
          </div>
          <div className="control">
            <button type="submit" className="button is-dark">
              Reload
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Main() {
  const [urls, setUrls] = useState(null);

  useEffect(() => {
    fetchImages("shiba").then((urls) => {
      setUrls(urls);
    });
  }, []);

  function reloadImages(breed: string) {
    fetchImages(breed).then((urls) => {
      setUrls(urls);
    });
  }

  return (
    <main>
      <section className="section">
        <div className="container">
          <Form onFormSubmit={reloadImages} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Gallery urls={urls} />
        </div>
      </section>
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <p>Dog images retrived from Dog API</p>
        <p>
          <a href="https://dog.ceo/dog-api/about">Donate to Dog API</a>
        </p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;

//
// ぬふふふふふf