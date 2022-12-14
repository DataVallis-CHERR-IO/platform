import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import useAuth from '../../../hooks/use-auth'
import { truncateAddress } from '../../../utils'
import { alpha, Button, ListItemIcon, Menu, MenuItem, MenuProps, styled } from '@mui/material'
import { Dashboard, Logout } from '@mui/icons-material'
import { useSessionContext } from '../../../contexts/session/provider'

const Header: React.FC = () => {
  const { t } = useTranslation('common')
  const { account } = useSessionContext()
  const { connect, disconnect } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleOnClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Head>
        <title>CHERR.IO | Platform</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
        <meta name='description' content='' />
        <meta name='author' content='' />
      </Head>
      <div
        className='container'
        style={{ position: 'fixed', zIndex: '1030', right: '0', left: '0', backgroundColor: '#FFFFFF', maxWidth: 'unset', textAlign: 'center' }}
      >
        <div>CHERR.IO MVP2 is currently deployed on ETH Goerli TestNet for testing purposes, therefore technical disruptions may occur.</div>
      </div>
      <nav className='navbar navbar-expand-lg navbar-light fixed-top' id='mainNav' style={{ top: '22px' }}>
        <div className='container'>
          <div className='navbar-brand js-scroll-trigger'>
            <Image src='/img/logo-cherrio-white.svg' alt='Cherrio Logo' className='img-responsive logo-white' width={150} height={44} />
          </div>
          <div className='collapse navbar-collapse' id='navbarResponsive'>
            <ul className='navbar-nav mx-auto mr-00'>
              <li className='nav-item'>
                <Link href='/'>
                  <a className='nav-link js-scroll-trigger'>{t('home.text')}</a>
                </Link>
              </li>
              <li className='nav-item'>
                <Link href='/projects'>
                  <a className='nav-link js-scroll-trigger'>{t('projects')}</a>
                </Link>
              </li>
              <li className='nav-item'>
                <Link href='https://www.cherr.io/'>
                  <a className='nav-link js-scroll-trigger'>{t('about')}</a>
                </Link>
              </li>
              {!account ? (
                <Button id='navbar-account-disconnected-button' variant='contained' disableElevation onClick={connect} className='dark-btn text-uppercase'>
                  {t('connectWallet')}
                </Button>
              ) : (
                <div>
                  <Button
                    id='navbar-account-connected-button'
                    aria-controls={open ? 'navbar-account-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                    variant='contained'
                    disableElevation
                    onClick={event => handleOnClick(event)}
                    className='dark-btn'
                  >
                    {truncateAddress(account)}
                  </Button>
                  <StyledMenu
                    id='navbar-account-menu'
                    MenuListProps={{
                      'aria-labelledby': 'navbar-account-button'
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleOnClose}
                  >
                    <MenuItem>
                      <ListItemIcon>
                        <Dashboard fontSize='small' />
                      </ListItemIcon>
                      <Link href='/dashboard'>{t('dashboard')}</Link>
                    </MenuItem>
                    <MenuItem onClick={disconnect}>
                      <ListItemIcon>
                        <Logout fontSize='small' />
                      </ListItemIcon>
                      {t('disconnectWallet')}
                    </MenuItem>
                  </StyledMenu>
                </div>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    }
  }
}))
