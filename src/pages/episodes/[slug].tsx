import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router"
import Image from "next/image";
import Link from "next/link"
import { api } from "../../services/api";
import styles from "./episode.module.scss"
import { convertDurationToTimeString } from "../../utils/ConvertDurationToTimeString";
import { useContext } from "react";
import { PlayerContext } from "../../context/playerContext";

type Episodes = {
    id: string;
    title: string;
    description: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    thumbnail: string;
    publishedAt: string;
}

type episodeProps = {
    episode: Episodes;
}

export default function Episode({ episode }: episodeProps) {

    const { play } = useContext(PlayerContext);
    
    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                <button type="button">
                    <img src="/arrow-left.svg" alt="Voltar" />
                </button>
                </Link>
                <Image width={900} height={400} src={episode.thumbnail} objectFit='cover'></Image>
                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio" />
                </button>
            </div>  

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{__html : episode.description}} />
            
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`/episodes/${slug}`)


    const episode = {
          id: data.id,
          title: data.title,
          thumbnail: data.thumbnail,
          members: data.members,
          publishedAt: new Date(data.published_at).toLocaleDateString('pt-br', { dateStyle: ('short') }),
          duration: Number(data.file.duration),
          durationAsString: convertDurationToTimeString(Number(data.file.duration)),
          description: data.description,
          url: data.file.url
        }

    return {
        props: {episode},
        revalidate: 60 * 60 * 24, //24 horas
    }

}