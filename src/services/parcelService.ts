import DatabaseService from './databaseService';

export interface Parcel {
  id?: string;
  landowner_name: string;
  phone_number: string;
  geojson: any;
  centroid: number[]; // [lng, lat]
  bbox: number[]; // [minX, minY, maxX, maxY]
  owner_id?: string;
  created_at?: string;
}

const PARCELS_TABLE = 'parcels';

/**
 * Parcel Service
 * Handles all database operations related to land parcels.
 */
const ParcelService = {
  /**
   * Fetch all parcels
   */
  getParcels: async () => {
    return await DatabaseService.fetchAll<Parcel>(PARCELS_TABLE);
  },

  /**
   * Add a new parcel
   */
  addParcel: async (parcelData: Parcel) => {
    return await DatabaseService.create<Parcel>(PARCELS_TABLE, parcelData);
  },

  /**
   * Update an existing parcel
   */
  updateParcel: async (id: string, updates: Partial<Parcel>) => {
    return await DatabaseService.update<Parcel>(PARCELS_TABLE, id, updates);
  },

  /**
   * Delete a parcel
   */
  deleteParcel: async (id: string) => {
    return await DatabaseService.remove(PARCELS_TABLE, id);
  },

  getOwnerParcels: async (ownerId: string) => {
    return await DatabaseService.fetchAll<Parcel>(PARCELS_TABLE, { owner_id: ownerId });
  },

  /**
   * Fetch parcels linked to a specific phone number
   */
  getParcelsByPhone: async (phoneNumber: string) => {
    return await DatabaseService.fetchAll<Parcel>(PARCELS_TABLE, { phone_number: phoneNumber });
  }
};

export default ParcelService;
