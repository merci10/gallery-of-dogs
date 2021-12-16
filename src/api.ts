export async function fetchImages(breed: string) {
  const _breed = breed.replace('-', '/');

  const response = await fetch(
    `https://dog.ceo/api/breed/${_breed}/images/random/12`
  );
  const data = await response.json();
  return data.message;
}