// src/components/Navigation/Navbar.js
const Navbar = () => (
  <nav className='bg-blue-600 p-4'>
    <div className='container mx-auto flex items-center justify-between'>
      <h1 className='text-white text-2xl font-bold'>Locate a Socket</h1>
      <div className='flex space-x-4'>
        <button className='text-white hover:text-blue-200'>Login</button>
        <button className='bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50'>
          Sign Up
        </button>
      </div>
    </div>
  </nav>
);

export default Navbar;
