import {getGames} from "@/services/rawg.service";




export default async function Home() {

    const games = await getGames()
    console.log(games)
  return (
    <div></div>
  )
}
