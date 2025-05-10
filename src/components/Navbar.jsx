import { Link } from 'react-router-dom'
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            ComicStore
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/catalog" className="text-gray-600 hover:text-primary-600">
              Catálogo
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-primary-600">
              <ShoppingCartIcon className="h-6 w-6" />
            </Link>
            <Link to="/login" className="text-gray-600 hover:text-primary-600">
              <UserIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 