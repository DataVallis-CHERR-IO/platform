import React from 'react'
import Campaigns from '../../views/campaigns'
import Subscribe from '../../views/subscribe'
import Header from '../../views/home/header'
import CharityDAO from '../../views/home/charity-dao'
import ProblemAndSolution from '../../views/home/problem-and-solution'
import TopFeatures from '../../views/home/top-features'

const Home: React.FC = () => {
  return (
    <>
      <Header /> <Campaigns /> <CharityDAO /> <ProblemAndSolution /> <TopFeatures /> <Subscribe />
    </>
  )
}

export default Home
