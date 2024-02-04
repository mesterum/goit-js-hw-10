import { Notify } from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select'
import 'slim-select/dist/slimselect.css'
import { Option } from 'slim-select/dist/store';


/** @type {HTMLSelectElement} */
const breedDiv: HTMLDivElement = document.querySelector(".breed-select")!
const breedSelect: HTMLSelectElement = breedDiv.querySelector("select")!

// breedSlimSelect.select.hideUI()
// breedSelect.hidden = false
const loader: HTMLParagraphElement = document.querySelector("p.loader")!
const error: HTMLParagraphElement = document.querySelector("p.error")!
const catInfo: HTMLDivElement = document.querySelector("div.cat-info")!

type Breed = {
  id: string;
  name: string;
  temperament: string;
  origin: string;
  description: string;
  reference_image_id: string;
  image: Omit<CatImages[0], "breeds">
};
type CatImages = {
  breeds: Omit<Breed, "image">[];
  id: string;
  url: string;
  width: number;
  height: number;
}[]

/* breedSelect.hidden = true
error.hidden = true
catInfo.hidden = true */

let breedsMap: Map<string, Breed>

breedSelect.value = ""
fetchBreeds().then((breeds: Breed[]) => {
  breedsMap = new Map(breeds.map(breed => [breed.id, breed]))
  // console.log(breeds);
  breedSlimSelect.setData([{ text: "Select a breed", value: "", disabled: true }
    , ...breeds.map(b => ({ text: b.name, value: b.id }))])
  /* 
  breedSelect.append(
    ...breeds.map(breed => {
      const option = document.createElement("option")
      option.value = breed.id
      option.textContent = breed.name
      return option
    }
    )) */
  // breedSelect.value = ""
  breedSlimSelect.open()
  loader.hidden = true
  // breedSlimSelect.select.showUI()
  breedDiv.hidden = false
  // error.style.display = "block"
  // catInfo.style.display = "block"
})

const breedSlimSelect = new SlimSelect({
  select: breedSelect,
  events: {
    afterChange: ([newVal]: Option[]) => {
      if (newVal.value === "") return
      loader.hidden = false
      error.hidden = true
      catInfo.hidden = true
      const image = catInfo.querySelector("img")!
      fetchCatByBreed(newVal.value).then((catImages: CatImages) => {
        // Malayan cats case
        if (!catImages.length) {
          const { image, ...breed } = breedsMap.get(newVal.value)!
          catImages = [{ breeds: [breed], ...image }]
        }
        console.log(catImages);
        const [{ url, breeds: [b] }] = catImages
        image.alt = b.name
        image.title = b.name
        image.src = url ?? `https://placehold.co/600x400?text=No+${encodeURI(b.name.replace(" ", "+"))}+pics`
        catInfo.querySelector("h2")!.textContent = b.name
        catInfo.querySelector("p")!.textContent = b.description
        catInfo.querySelector("span")!.textContent = b.temperament
        return image.decode()
      }).then(() => {
        catInfo.hidden = false
      }).catch((err: Error) => {
        Notify.failure(err.message)
        // error.hidden = false
      }).finally(() => {
        loader.hidden = true
      })
    },

    // beforeChange: ([newVal]: Option[], [oldVal]: Option[]) => {
    //   console.log(oldVal, newVal);
    //   return true;
    // }
  }
})