function Cart() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-600 mb-6">Carrito de Compras</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          {/* Aquí irán los items del carrito */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 bg-gray-200 rounded"></div>
              <div>
                <h3 className="font-semibold">Título del Comic</h3>
                <p className="text-gray-600">Cantidad: 1</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary-600 font-bold">$19.99</p>
              <button className="text-red-600 text-sm">Eliminar</button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span>$19.99</span>
          </div>
          <button className="btn btn-primary w-full mt-4">
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart 