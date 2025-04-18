import React from 'react';

const OrderComponent = ({ narudzba, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          maxWidth: '700px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.2)',
        }}
      >
        <h2 className="text-xl font-bold mb-4">Order Details #{narudzba.id}</h2>

        <div className="space-y-2">
          <p><strong>Order ID:</strong> {narudzba.id}</p>
          <p><strong>Status:</strong> {narudzba.status}</p>
          <p><strong>Buyer ID:</strong> {narudzba.kupacId}</p>
          <p><strong>Store ID:</strong> {narudzba.prodavnicaId}</p>
          <p><strong>Delivery Address:</strong> {narudzba.adresa}</p>
          <p><strong>Created At:</strong> {new Date(narudzba.datum).toLocaleString()}</p>
          <p><strong>Total Price:</strong> ${narudzba.ukupnaCijena}</p>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Products:</h3>
            {narudzba.cijeneProizvoda.map((cijena, index) => (
              <div key={index} className="mb-2">
                <p><strong>Product {index + 1}:</strong></p>
                <p>Price: ${cijena}</p>
                <p>Quantity: {narudzba.kolicineProizvoda[index]}</p>
              </div>
            ))}
          </div>

          <p className="mt-4"><strong>Is Cancelled:</strong> {narudzba.isCancelled ? "Yes" : "No"}</p>
        </div>

        {}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderComponent;
