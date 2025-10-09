const API_BASE_URL = 'http://localhost:8080/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return { error: errorText || `HTTP error! status: ${response.status}` };
    }

    try {
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: null as T };
    }
  }

  private getUserRole(): string {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role?.toLowerCase() || 'farmer';
    }
    return 'farmer';
  }

  private getCropEndpoint(): string {
    const role = this.getUserRole();
    return `${API_BASE_URL}/${role}/crops`;
  }

  private transformBackendCropToFrontend(backendCrop: any): any {
    return {
      id: String(backendCrop.id),
      user_id: String(backendCrop.user?.id || ''),
      name: backendCrop.name,
      crop_type: backendCrop.cropType,
      harvest_date: backendCrop.harvestDate,
      expiry_date: backendCrop.expiryDate,
      soil_type: backendCrop.soilType,
      pesticides_used: backendCrop.pesticidesUsed,
      image_url: backendCrop.imageUrl,
      created_at: backendCrop.createdAt,
      farmer_info: backendCrop.farmerLocation ? {
        location: backendCrop.farmerLocation,
        name: backendCrop.farmerName || backendCrop.user?.name || '',
        farmer_id: backendCrop.farmerId || backendCrop.user?.farmerId || ''
      } : undefined
    };
  }

  async signIn(email: string, password: string): Promise<ApiResponse<any>> {
    try {
      console.log('Attempting backend login for:', email);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await this.handleResponse(response);
      if (result.data?.token) {
        localStorage.setItem('auth_token', result.data.token);
        const userData = {
          id: result.data.id,
          email: result.data.email,
          role: result.data.role,
          name: result.data.name,
          location: result.data.location,
          farmer_id: result.data.farmerId,
          distributor_id: result.data.distributorId
        };
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Backend login successful, token and user stored');
      }
      return result;
    } catch (error) {
      console.error('Backend login failed:', error);
      return { error: 'Network error occurred' };
    }
  }

  async signUp(userData: {
    email: string;
    password: string;
    name: string;
    location: string;
    role: string;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('Attempting backend registration for:', userData.email);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          role: userData.role.toUpperCase()
        })
      });

      const result = await this.handleResponse(response);
      if (result.data?.token) {
        localStorage.setItem('auth_token', result.data.token);
        const userDataStored = {
          id: result.data.id,
          email: result.data.email,
          role: result.data.role,
          name: result.data.name,
          location: result.data.location,
          farmer_id: result.data.farmerId,
          distributor_id: result.data.distributorId
        };
        localStorage.setItem('user', JSON.stringify(userDataStored));
        console.log('Backend registration successful');
      }
      return result;
    } catch (error) {
      console.error('Backend registration failed:', error);
      return { error: 'Network error occurred' };
    }
  }

  async getCrops(): Promise<ApiResponse<any[]>> {
    try {
      const endpoint = this.getCropEndpoint();
      console.log('Fetching crops from:', endpoint);
      const response = await fetch(endpoint, {
        headers: this.getAuthHeaders()
      });

      const result = await this.handleResponse(response);
      if (result.data) {
        result.data = result.data.map((crop: any) => this.transformBackendCropToFrontend(crop));
      }
      return result;
    } catch (error) {
      console.error('Get crops failed:', error);
      return { error: 'Network error occurred' };
    }
  }

  async createCrop(cropData: any): Promise<ApiResponse<any>> {
    try {
      const endpoint = this.getCropEndpoint();
      console.log('Creating crop at:', endpoint, 'with data:', cropData);

      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const backendData = {
        name: cropData.name,
        cropType: cropData.crop_type || cropData.cropType,
        harvestDate: cropData.harvest_date || cropData.harvestDate,
        expiryDate: cropData.expiry_date || cropData.expiryDate,
        soilType: cropData.soil_type || cropData.soilType,
        pesticidesUsed: cropData.pesticides_used || cropData.pesticidesUsed || 'Not specified',
        imageUrl: cropData.image_url || cropData.imageUrl || '',
        farmerLocation: cropData.location || cropData.farmer_info?.location || user?.location || '',
        farmerId: cropData.farmer_info?.farmer_id || user?.farmer_id,
        farmerName: cropData.farmer_info?.name || user?.name
      };

      console.log('Sending to backend:', backendData);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(backendData)
      });

      const result = await this.handleResponse(response);
      if (result.error) {
        console.error('Backend crop creation failed:', result.error);
      } else {
        console.log('Backend crop creation successful:', result.data);
        if (result.data) {
          result.data = this.transformBackendCropToFrontend(result.data);
        }
      }
      return result;
    } catch (error) {
      console.error('Create crop network error:', error);
      return { error: 'Network error occurred' };
    }
  }

  async updateCrop(cropId: string, cropData: any): Promise<ApiResponse<any>> {
    try {
      const endpoint = `${this.getCropEndpoint()}/${cropId}`;
      console.log('Updating crop at:', endpoint, 'with data:', cropData);

      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const backendData = {
        name: cropData.name,
        cropType: cropData.crop_type || cropData.cropType,
        harvestDate: cropData.harvest_date || cropData.harvestDate,
        expiryDate: cropData.expiry_date || cropData.expiryDate,
        soilType: cropData.soil_type || cropData.soilType,
        pesticidesUsed: cropData.pesticides_used || cropData.pesticidesUsed || 'Not specified',
        imageUrl: cropData.image_url || cropData.imageUrl || '',
        farmerLocation: cropData.location || cropData.farmer_info?.location || user?.location || ''
      };

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(backendData)
      });

      const result = await this.handleResponse(response);
      if (result.error) {
        console.error('Backend crop update failed:', result.error);
      } else {
        console.log('Backend crop update successful:', result.data);
        if (result.data) {
          result.data = this.transformBackendCropToFrontend(result.data);
        }
      }
      return result;
    } catch (error) {
      console.error('Update crop network error:', error);
      return { error: 'Network error occurred' };
    }
  }

  async deleteCrop(cropId: string): Promise<ApiResponse<any>> {
    try {
      const endpoint = `${this.getCropEndpoint()}/${cropId}`;
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  async getAllFarmerCrops(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/farmer/crops/all`, {
        headers: this.getAuthHeaders()
      });

      const result = await this.handleResponse(response);
      if (result.data) {
        result.data = result.data.map((crop: any) => this.transformBackendCropToFrontend(crop));
      }
      return result;
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  async getCropsByFarmerId(farmerId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/farmer/crops/by-farmer/${farmerId}`, {
        headers: this.getAuthHeaders()
      });

      const result = await this.handleResponse(response);
      if (result.data) {
        result.data = result.data.map((crop: any) => this.transformBackendCropToFrontend(crop));
      }
      return result;
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  async getAllDistributorCrops(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/distributor/crops/all`, {
        headers: this.getAuthHeaders()
      });

      const result = await this.handleResponse(response);
      if (result.data) {
        result.data = result.data.map((crop: any) => this.transformBackendCropToFrontend(crop));
      }
      return result;
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  async getCropsByDistributorId(distributorId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/distributor/crops`, {
        headers: this.getAuthHeaders()
      });

      const result = await this.handleResponse(response);
      if (result.data) {
        result.data = result.data.map((crop: any) => this.transformBackendCropToFrontend(crop));
      }
      return result;
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  async getCropForScanning(cropId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/crops/scan/${cropId}`);
      return await this.handleResponse(response);
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  async deleteUser(userId: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  async getAllUsers(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  signOut(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}

export const apiService = new ApiService();
