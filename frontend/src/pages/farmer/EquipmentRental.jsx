import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaTractor, FaCalendarAlt, FaMapMarkerAlt, FaStar, FaCheckCircle, FaFilter, FaSearch, FaUserTie } from 'react-icons/fa';

export default function EquipmentRental() {
  const [equipment, setEquipment] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    rentalDays: 1,
    needOperator: true,
    deliveryAddress: 'Main Farm Gate, Bilikere, Hunsur Taluk, Mysuru',
    notes: 'Need for bed preparation and furrowing before seedling arrival.',
  });

  useEffect(() => {
    fetchEquipment();
    fetchBookings();
  }, []);

  const fetchEquipment = async () => {
    try {
      const { data } = await api.get('/equipment');
      if (data.success) {
        setEquipment(data.equipment);
      }
    } catch (err) {
      console.error('Failed to fetch equipment', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/equipment/bookings/my');
      if (data.success) {
        setMyBookings(data.bookings);
      }
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!bookingModal) return;
    try {
      const { data } = await api.post('/equipment/bookings', {
        equipmentId: bookingModal._id,
        ...bookingForm,
      });
      if (data.success) {
        toast.success('Equipment rental booked successfully!');
        setBookingModal(null);
        fetchBookings();
        setActiveTab('bookings');
      }
    } catch (err) {
      toast.error('Failed to book equipment');
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div className="fade-in max-w-6xl mx-auto">
      <div className="page-header flex justify-between items-start mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <FaTractor className="text-gold" /> Agricultural Equipment Rental Hub
          </h1>
          <p className="page-subtitle">Access tractors, drone sprayers, harvesters, and implements with certified operators on-demand.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border mb-8">
        <button
          onClick={() => setActiveTab('browse')}
          className={`pb-4 px-2 font-bold text-sm border-b-2 flex items-center gap-2 ${
            activeTab === 'browse' ? 'border-primary text-primary-light' : 'border-transparent text-text-muted hover:text-white'
          }`}
        >
          <FaSearch /> Browse Equipment Catalog ({equipment.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-4 px-2 font-bold text-sm border-b-2 flex items-center gap-2 ${
            activeTab === 'bookings' ? 'border-gold text-gold' : 'border-transparent text-text-muted hover:text-white'
          }`}
        >
          <FaCalendarAlt /> My Equipment Bookings ({myBookings.length})
        </button>
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((item) => (
            <div key={item._id} className="card overflow-hidden flex flex-col group border-border hover:border-primary-light transition-all">
              <div className="relative h-48 overflow-hidden bg-bg-surface">
                <img
                  src={item.images?.[0] || 'https://via.placeholder.com/400x300?text=Equipment'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 badge badge-primary !text-[10px]">{item.category}</span>
                <span className="absolute top-3 right-3 badge badge-gold flex items-center gap-1 !text-[10px]">
                  <FaStar size={10} /> {item.rating} ({item.totalReviews})
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary-light transition-colors">{item.name}</h3>
                  <p className="text-xs text-text-muted line-clamp-2 mb-4">{item.description}</p>
                  
                  <div className="text-xs text-text-secondary flex items-center gap-1 mb-2">
                    <FaMapMarkerAlt className="text-gold" /> {item.location?.village}, {item.location?.district}, {item.location?.state}
                  </div>
                  {item.withOperator && (
                    <div className="text-xs text-primary-light flex items-center gap-1 mb-4 font-bold">
                      <FaUserTie /> Verified Operator Included Available (+₹{item.operatorChargePerDay}/day)
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] text-text-muted uppercase">Daily Rental Rate</span>
                    <p className="text-xl font-black text-gold">₹{item.dailyRate?.toLocaleString()}<span className="text-xs text-text-muted font-normal">/day</span></p>
                  </div>
                  <button onClick={() => setBookingModal(item)} className="btn btn-primary btn-sm px-5">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {myBookings.length > 0 ? (
            myBookings.map((b) => (
              <div key={b._id} className="card p-6 border-l-4 border-gold flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="badge badge-primary !text-[10px] mb-2">{b.status}</span>
                  <h4 className="text-lg font-bold">{b.equipment?.name || 'Agricultural Equipment'}</h4>
                  <p className="text-xs text-text-muted">
                    Dates: {new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()} ({b.rentalDays} Day{b.rentalDays > 1 ? 's' : ''})
                  </p>
                  <p className="text-xs text-text-muted mt-1">Delivery: {b.deliveryAddress}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-muted uppercase font-bold">Total Paid</p>
                  <p className="text-2xl font-black text-gold">₹{b.totalPrice?.toLocaleString()}</p>
                  <span className="badge badge-success !text-[9px] mt-1">Confirmed & Scheduled</span>
                </div>
              </div>
            ))
          ) : (
            <div className="card p-12 text-center text-text-muted">
              <FaTractor className="text-4xl mx-auto mb-4 opacity-40 text-gold" />
              <p>No equipment rentals booked yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="card max-w-lg w-full p-8 bg-bg-card border border-primary/30 relative">
            <h3 className="text-xl font-bold mb-2">Book {bookingModal.name}</h3>
            <p className="text-xs text-gold font-bold mb-6">Rate: ₹{bookingModal.dailyRate}/day • Security Deposit: ₹{bookingModal.securityDeposit}</p>

            <form onSubmit={handleBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={bookingForm.startDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Rental Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={bookingForm.rentalDays}
                    onChange={(e) => setBookingForm({ ...bookingForm, rentalDays: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Delivery Address / Farm Plot</label>
                <input
                  type="text"
                  className="form-input"
                  value={bookingForm.deliveryAddress}
                  onChange={(e) => setBookingForm({ ...bookingForm, deliveryAddress: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="operator"
                  checked={bookingForm.needOperator}
                  onChange={(e) => setBookingForm({ ...bookingForm, needOperator: e.target.checked })}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="operator" className="text-xs text-text-primary">
                  Request certified operator (+₹{bookingModal.operatorChargePerDay}/day)
                </label>
              </div>

              <div className="p-4 rounded-xl bg-bg-surface border border-border flex justify-between items-center my-4">
                <span className="text-xs font-bold text-text-muted">Total Estimated Amount</span>
                <span className="text-2xl font-black text-gold">
                  ₹{(bookingModal.dailyRate * bookingForm.rentalDays + (bookingForm.needOperator ? bookingModal.operatorChargePerDay * bookingForm.rentalDays : 0)).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setBookingModal(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Booking & Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
