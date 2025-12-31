import HomePage from '@/components/HomePage'
import { createClient } from '@/prismicio'

const Home = async () => {
  const client = createClient()
  const homepage = await client.getSingle('homepage')

  return <HomePage data={homepage.data} />
}

export default Home
