import { useContext, useEffect } from "react"
import { PlayerContext } from "../contexts/PlayerContext"

import { GetStaticProps } from 'next' 
import Image from 'next/image'
import  Link from 'next/link'

import ptBR from 'date-fns/locale/pt-BR'
import { api } from "../service/api"
import { format, parseISO } from 'date-fns'
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString"

import styles from './home.module.scss'

type Episode = {
  id: string
  title: string
  thumbnail: string
  members: string
  duration: number
  durationAsString: string
  publishedAt: string
  url: string,
}
type HomeProps = {
  // episodes: Array<{
  //   id: string;
  //   title: string;
  //   members: string;
  // }>
  latestEpisodes: Array<Episode>
  allEpisodes: Array<Episode>
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { play } = useContext(PlayerContext)
  //SSR ou SSG
  //console.log(props.episodes)

  //SPA - Javascript do navegador
  // useEffect(()=>{
  //   fetch('http://localhost:3333/episodes')
  //   .then(res => res.json())
  //   .then(json => console.log(json))
  // },[])

  return (
    <div className={styles.homePage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos </h2>

        <ul>
          {latestEpisodes.map(episode => {
            return(
              <li key={episode.id}>
                <Image 
                  width={192} height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit='cover'
                  // cover - cobrir a area sem esmagar a imagem
                  //contain - tbm faz porem nao cobre apenas se preocupa com o contéudo
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>
                      {episode.title}
                    </a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button 
                  type='button' 
                  className={styles.buttonPlay}
                  onClick={() => play(episode)}
                >
                  <img src="/play-green.svg" alt="Tocar"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os Episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode=>{
              return(
                <tr key={episode.id}>
                  <td style={{ width: 100 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit='cover'
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type='button' className={styles.buttonPlay}>
                      <img src="/play-green.svg" alt="Tocar"/>
                    </button>
                  </td>

                </tr>
              )
            })}
          </tbody>
        </table>
      
      </section>
    </div>
  )
}

//SSR - Javascript no server - passar props para o component 
// export async function getServerSideProps (){parseISO(episode.published_at)
//   const resource = await fetch('http://localhost:3333/episodes')
//   const data = await resource.json()

//   return { 
//     props: {
//       episodes: data,
//     }
//   }
//}

//SSG - Javascript no server - passar props para o component - para muitas requisiçoes da aplicaçao
// export async function getStaticProps (){
//   const resource = await fetch('http://localhost:3333/episodes')
//   const data = await resource.json()

//   return { 
//     props: {
//       episodes: data,
//     },
//    revalidate: 60 * 60 * 8, //8 horas - 3 chamadas por dia ele atualiza
//   }
// }


export const getStaticProps: GetStaticProps = async () => {
  // const resource = await fetch('http://localhost:3333/episodes?_limit=12&_sort=published_at&_order=desc')
  // const data = await resource.json()
  
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
  //ou
  //const data = resource.data

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yyy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2) 
  const allEpisodes = episodes.slice(2, episodes.length)

  return { 
    props: {
      latestEpisodes,
      allEpisodes
    },
   revalidate: 60 * 60 * 8, //8 horas - 3 chamadas por dia ele atualiza
  }
}
