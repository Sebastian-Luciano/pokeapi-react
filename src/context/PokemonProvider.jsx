import { useEffect, useState } from "react"
import { PokemonContext } from "./PokemonContext"
import { useForm } from "../hook/useForm"

export const PokemonProvider = ({ children }) => {
  const [allPokemons, setAllPokemons] = useState([])
  const [globalPokemons, setGlobalPokemons] = useState([])
  const [offset, setOffset] = useState(0)

  //Utilizar CustomHook - useform
  const { valueSearch, onInputChange, onResetForm } = useForm({
    valueSearch: '',
  })

  // Estados para la aplicacion simples
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(false)

  // Llamar 50 pokemos a la API
  const getAllPokemons = async (limit = 50) => {
    const baseURL = 'https://pokeapi.co/api/v2/'

    const res = await fetch(`${baseURL}pokemon?limit=${limit}&offset=${offset}`)
    const data = await res.json()

    const promises = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url)
      const data = await res.json()
      return data
    })
    const results = await Promise.all(promises)

    setAllPokemons([...allPokemons, ...results])
    setLoading(false)
  }

  // Llamar todos los pokemones
  const getGlobalPokemons = async () => {
    const baseURL = 'https://pokeapi.co/api/v2/'

    const res = await fetch(`${baseURL}pokemon?limit=100000&offset=0`)
    const data = await res.json()

    const promises = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url)
      const data = await res.json()
      return data
    })

    const results = await Promise.all(promises)

    setGlobalPokemons(results)
    setLoading(false)
  }


  // Llmar a un pokemon por id
  const getPokemonByID = async (id) => {
    const baseURL = 'https://pokeapi.co/api/v2/'

    const res = await fetch(`${baseURL}pokemon/${id}`)
    const data = await res.json()
    return data
  }

  useEffect(() => {
    getAllPokemons()
  }, [offset])

  useEffect(() => {
    getGlobalPokemons()
  }, [])

  // BTN CARGAR MÁS
  const onClickLoadMore = () => {
    setOffset(offset + 50);
  }

  // Filter Function + State
	const [typeSelected, setTypeSelected] = useState({
		grass: false,
		normal: false,
		fighting: false,
		flying: false,
		poison: false,
		ground: false,
		rock: false,
		bug: false,
		ghost: false,
		steel: false,
		fire: false,
		water: false,
		electric: false,
		psychic: false,
		ice: false,
		dragon: false,
		dark: false,
		fairy: false,
		unknow: false,
		shadow: false,
	});

  const [filteredPokemons, setfilteredPokemons] = useState([]);

	const handleCheckbox = e => {
		setTypeSelected({
			...typeSelected,
			[e.target.name]: e.target.checked,
		});

		if (e.target.checked) {
			const filteredResults = globalPokemons.filter(pokemon => 
        pokemon.types
          .map(type => type.type.name)
          .includes(e.target.name)
        );
			setfilteredPokemons([...filteredPokemons, ...filteredResults]);
		} else {
			const filteredResults = filteredPokemons.filter(pokemon => 
        !pokemon.types
            .map(type => type.type.name)
            .includes(e.target.name)
          );
			setfilteredPokemons([...filteredResults]);
		}
	};


    return (
      <PokemonContext.Provider value={{
        valueSearch,
        onInputChange,
        onResetForm,
        allPokemons,
        globalPokemons,
        getPokemonByID,
        onClickLoadMore,
        //loader
        loading,
        setLoading,
        //btn filter
        active,
        setActive,
        //filter contenier
				handleCheckbox,
				filteredPokemons,
      }}>
        {children}
      </PokemonContext.Provider>
    )
  }