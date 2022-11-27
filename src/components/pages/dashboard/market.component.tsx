import React from 'react'
import YourSuppliesAccordion from '../../../themes/components/surfaces/your-supplies.accordion'
import AssetsToSupplyAccordion from '../../../themes/components/surfaces/assets-to-supply.accordion'
import YourBorrowsAccordion from '../../../themes/components/surfaces/your-borrows.accordion'
import { useSession } from 'next-auth/react'
import AssetsToBorrowAccordion from '../../../themes/components/surfaces/assets-to-borrow.accordion'

const MarketComponent: React.FC = () => {
  const { data: session } = useSession()

  return (
    <section className='section-1'>
      <div className='container'>
        <div className='row'>
          <div className='col-sm-12 col-md-12 col-lg-6 animation-1 mt-4'>
            <YourSuppliesAccordion account={session?.user?.name} />
          </div>
          <div className='col-sm-12 col-md-12 col-lg-6 animation-1 mt-4'>
            <YourBorrowsAccordion account={session?.user?.name} />
          </div>
          <div className='col-sm-12 col-md-12 col-lg-6 animation-1 mt-4'>
            <AssetsToSupplyAccordion account={session?.user?.name} />
          </div>
          <div className='col-sm-12 col-md-12 col-lg-6 animation-1 mt-4'>
            <AssetsToBorrowAccordion account={session?.user?.name} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default MarketComponent
