import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import EmptyState from '../components/EmptyState';
import Footer from '../components/Footer';
import SectionHeader from '../components/SectionHeader';
import { apiFetch } from '../services/apiFetch';
import { notify } from '../services/notify';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return '';
  }

  const payload = token.split('.')[1];

  if (!payload) {
    return '';
  }

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = `${base64}${'='.repeat((4 - (base64.length % 4)) % 4)}`;
    const decoded = JSON.parse(atob(paddedBase64));

    return decoded?.id ? String(decoded.id) : '';
  } catch {
    return '';
  }
};

function Trips() {
  const currentUserId = getUserIdFromToken();
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [joiningTripId, setJoiningTripId] = useState(null);
  const [memberCounts, setMemberCounts] = useState({});
  const [selectedTripForMembers, setSelectedTripForMembers] = useState(null);
  const [tripMembers, setTripMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const getTripMemberCount = useCallback((trip) => {
    if (trip && typeof trip.joinedCount === 'number') return trip.joinedCount;
    if (trip && Array.isArray(trip.members)) return trip.members.length;
    return 0;
  }, []);

  const formatTripDate = useCallback((value) => {
    if (!value) return '--';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleDateString();
  }, []);

  const viewTripMembers = useCallback(async (tripId) => {
    setSelectedTripForMembers(tripId);
    setIsLoadingMembers(true);
    try {
      const data = await apiFetch(`/trips/${tripId}/members`);
      setTripMembers(Array.isArray(data.members) ? data.members : []);
    } catch (err) {
      notify({
        message: err?.message || 'Failed to load members',
        type: 'error',
      });
      setTripMembers([]);
    } finally {
      setIsLoadingMembers(false);
    }
  }, []);

  useEffect(() => {
    const loadTrips = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await apiFetch('/trips');
        const safeTrips = Array.isArray(data) ? data : [];
        setTrips(safeTrips);
        setMemberCounts(
          safeTrips.reduce((acc, trip) => {
            acc[trip._id] = getTripMemberCount(trip);
            return acc;
          }, {})
        );
      } catch (err) {
        setError(err?.message || 'Failed to load trips');
      } finally {
        setIsLoading(false);
      }
    };

    loadTrips();
  }, [getTripMemberCount]);

  return (
    <div className='fg-page min-h-screen px-4 py-10 sm:py-12'>
      <div className='fg-orb fg-orb-1' aria-hidden='true' />
      <div className='fg-orb fg-orb-2' aria-hidden='true' />
      <div className='fg-page-content mx-auto w-full max-w-6xl fg-rise'>
        <div className='mb-8 flex flex-wrap items-end justify-between gap-4'>
          <SectionHeader
            kicker='Explore trips'
            title='Available trips'
            subtitle='Discover shared journeys, compare destinations, and join trips that fit your timing and budget.'
          />
          <div className='flex flex-wrap items-center gap-3'>
            <BackButton />
            <span className='fg-chip text-xs font-semibold'>{trips.length} trips</span>
            <Link to='/create-trip' className='fg-btn-secondary text-xs'>
              Create trip
            </Link>
          </div>
        </div>

        {trips.some((trip) => trip.canManageTrip === true || trip.viewerRole === 'admin') && (
          <div className='fg-card mb-6 border border-cyan-400/25 p-5'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <p className='fg-kicker text-xs font-semibold uppercase'>Member management</p>
                <h2 className='fg-title mt-2 text-lg font-semibold'>
                  View people who joined your trips
                </h2>
              </div>
              <span className='fg-chip text-xs font-semibold uppercase tracking-wide'>
                Admin only
              </span>
            </div>
            <div className='mt-4 flex flex-wrap gap-3'>
              {trips
                .filter((trip) => trip.canManageTrip === true || trip.viewerRole === 'admin')
                .slice(0, 3)
                .map((trip) => (
                  <button
                    key={`manage-${trip._id}`}
                    onClick={() => viewTripMembers(trip._id)}
                    className='fg-btn-secondary text-sm'
                  >
                    View members for {trip.destination}
                  </button>
                ))}
            </div>
          </div>
        )}

        {error && <div className='fg-alert mb-6 px-4 py-3 text-sm'>{error}</div>}

        {isLoading ? (
          <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
            {[...Array(6)].map((_, index) => (
              <div key={`loading-${index}`} className='fg-card p-6'>
                <div className='h-6 w-1/2 rounded-full bg-slate-800/70' />
                <div className='mt-4 flex flex-wrap gap-2'>
                  <div className='h-6 w-24 rounded-full bg-slate-800/70' />
                  <div className='h-6 w-28 rounded-full bg-slate-800/70' />
                  <div className='h-6 w-24 rounded-full bg-slate-800/70' />
                </div>
                <div className='mt-4 h-4 w-full rounded-full bg-slate-800/70' />
                <div className='mt-2 h-4 w-4/5 rounded-full bg-slate-800/70' />
                <div className='mt-5 h-10 w-32 rounded-full bg-slate-800/70' />
              </div>
            ))}
          </div>
        ) : trips.length === 0 ? (
          <EmptyState
            title='No trips yet'
            description='Be the first to share your destination and start planning with others.'
            actionLabel='Create your first trip'
            actionTo='/create-trip'
          />
        ) : (
          <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
            {trips.map((trip) => {
              const memberCount = memberCounts[trip._id] ?? getTripMemberCount(trip);
              const creatorId = trip.createdBy?._id || trip.createdBy || '';
              const isCreator = currentUserId && String(creatorId) === String(currentUserId);
              const canManageTrip =
                isCreator || trip.canManageTrip === true || trip.viewerRole === 'admin';
              const isAdmin = canManageTrip;
              const isFull = typeof trip.maxMembers === 'number' && memberCount >= trip.maxMembers;

              return (
                <div
                  key={trip._id}
                  className='fg-card p-6 transition hover:-translate-y-1 hover:shadow-lg'
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <h3 className='fg-title text-xl font-semibold'>{trip.destination}</h3>
                      <p className='fg-muted mt-2 text-sm'>
                        {trip.description ||
                          'A shared trip waiting for the right travel companions.'}
                      </p>
                    </div>
                    <div className='flex flex-col items-end gap-2'>
                      <span
                        className={`fg-chip text-[11px] font-semibold uppercase tracking-wide ${isFull ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
                      >
                        {isFull ? 'Full' : 'Open'}
                      </span>
                      <span className='fg-chip text-[11px] font-semibold uppercase tracking-wide'>
                        {isAdmin ? 'Admin' : 'Member'}
                      </span>
                    </div>
                  </div>

                  <div className='fg-muted mt-5 flex flex-wrap gap-2 text-xs font-semibold'>
                    <span className='fg-chip'>Date: {formatTripDate(trip.date)}</span>
                    <span className='fg-chip'>Budget: {trip.budget || 'Flexible'}</span>
                    <span className='fg-chip'>
                      Members: {memberCount ?? '--'}
                      {trip.maxMembers ? ` / ${trip.maxMembers}` : ''}
                    </span>
                  </div>

                  <div className='mt-6 flex flex-wrap gap-3'>
                    <button
                      onClick={() => viewTripMembers(trip._id)}
                      disabled={!isAdmin}
                      className='fg-btn-secondary text-sm disabled:cursor-not-allowed disabled:opacity-60'
                      title={
                        isAdmin
                          ? 'View people who joined this trip'
                          : 'Only the trip creator can view members'
                      }
                    >
                      {isAdmin ? 'View members' : 'Members (admin only)'}
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          setJoiningTripId(trip._id);
                          const currentCount = memberCount;
                          if (
                            typeof trip.maxMembers === 'number' &&
                            currentCount >= trip.maxMembers
                          ) {
                            notify({
                              message: 'This trip is full.',
                              type: 'error',
                            });
                            return;
                          }
                          const joinResult = await apiFetch(`/trips/join/${trip._id}`, {
                            method: 'POST',
                          });
                          if (typeof joinResult?.joinedCount === 'number') {
                            setMemberCounts((prev) => ({
                              ...prev,
                              [trip._id]: joinResult.joinedCount,
                            }));
                            setTrips((prev) =>
                              prev.map((item) =>
                                item._id === trip._id
                                  ? {
                                      ...item,
                                      joinedCount: joinResult.joinedCount,
                                      viewerRole: joinResult.viewerRole || item.viewerRole,
                                      canManageTrip:
                                        typeof joinResult.canManageTrip === 'boolean'
                                          ? joinResult.canManageTrip
                                          : item.canManageTrip,
                                    }
                                  : item
                              )
                            );
                          }
                          notify({
                            message: 'Joined trip successfully',
                            type: 'success',
                          });
                        } catch (err) {
                          notify({
                            message: err?.message || 'Failed to join trip',
                            type: 'error',
                          });
                        } finally {
                          setJoiningTripId(null);
                        }
                      }}
                      disabled={joiningTripId === trip._id || isFull || isAdmin}
                      className='fg-btn-primary text-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70'
                    >
                      {isAdmin
                        ? 'Admin access'
                        : isFull
                          ? 'Trip full'
                          : joiningTripId === trip._id
                            ? 'Joining...'
                            : 'Join trip'}
                    </button>
                    <Link to='/chat' className='fg-btn-secondary text-sm'>
                      Open chat
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Members Modal */}
        {selectedTripForMembers && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6'>
            <div className='fg-card w-full max-w-md rounded-lg p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <h3 className='fg-title text-lg font-semibold'>Trip members</h3>
                <button
                  onClick={() => {
                    setSelectedTripForMembers(null);
                    setTripMembers([]);
                  }}
                  className='fg-muted text-xl font-bold'
                >
                  ×
                </button>
              </div>

              {isLoadingMembers ? (
                <div className='space-y-3'>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className='h-10 rounded bg-slate-800/70' />
                  ))}
                </div>
              ) : tripMembers.length === 0 ? (
                <p className='fg-muted text-sm'>No members have joined yet.</p>
              ) : (
                <div className='space-y-3'>
                  {tripMembers.map((member) => (
                    <div
                      key={member._id || member}
                      className='fg-chip inline-block px-3 py-2 text-sm'
                    >
                      {typeof member === 'object' && member.name ? member.name : member}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  setSelectedTripForMembers(null);
                  setTripMembers([]);
                }}
                className='fg-btn-secondary mt-6 w-full text-sm'
              >
                Close
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

export default Trips;
