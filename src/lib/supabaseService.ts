import { supabase } from './supabase';

// ==================== THRIFT ITEMS ====================

export async function getThriftItems() {
  const { data, error } = await supabase
    .from('thrift_items')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching thrift items:', error);
    throw error;
  }
  return data;
}

export async function createThriftItem(item: {
  title: string;
  description: string;
  price: number;
  category?: string;
  condition?: string;
  image_url?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('thrift_items')
    .insert([
      {
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        condition: item.condition,
        image_url: item.image_url,
        user_id: user.id,
        user_email: user.email,
        status: 'active'
      }
    ])
    .select();
  
  if (error) throw error;
  return data[0];
}

export async function deleteThriftItem(id: string) {
  const { error } = await supabase
    .from('thrift_items')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting thrift item:', error);
    throw error;
  }
}

// ==================== LOST & FOUND ITEMS ====================

export async function getLostFoundItems() {
  const { data, error } = await supabase
    .from('lost_found_items')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching lost/found items:', error);
    throw error;
  }
  return data;
}

export async function createLostFoundItem(item: {
  title: string;
  description: string;
  type: 'lost' | 'found';
  location: string;
  date: string;
  image_url?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('lost_found_items')
    .insert([
      {
        title: item.title,
        description: item.description,
        type: item.type,
        location: item.location,
        date: item.date,
        image_url: item.image_url,
        user_id: user.id,
        user_email: user.email,
        status: 'active'
      }
    ])
    .select();
  
  if (error) {
    console.error('Error creating lost/found item:', error);
    throw error;
  }
  return data[0];
}


export async function deleteLostFoundItem(id: string) {
  const { error } = await supabase
    .from('lost_found_items')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting lost/found item:', error);
    throw error;
  }
}

// ==================== IMAGE UPLOAD ====================

export async function uploadItemImage(file: File): Promise<string | null> {
  try {
    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('item-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Upload error:', error);
      throw error;
    }

    console.log('✅ Upload successful:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('item-images')
      .getPublicUrl(filePath);

    console.log('🔗 Public URL:', publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// ==================== GET USER'S OWN POSTS ====================

export async function getMyThriftItems() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('thrift_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching my thrift items:', error);
    throw error;
  }
  return data;
}

export async function getMyLostFoundItems() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('lost_found_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching my lost/found items:', error);
    throw error;
  }
  return data;
}

// Update Thrift Item
export async function updateThriftItem(id: string, updates: Partial<{//partial-> all fields are optional
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  image_url?: string;
}>) {
  const { data, error } = await supabase //destructuring(extracts properties from object) 
    .from('thrift_items') //thrift_items table
    .update(updates) //the object we passed(what to update)
    .eq('id', id) // only update the row where id matches
    .select() //return the updated row
    .single(); //return as a single object

  if (error) throw error; // If update failed, throw error
  return data; //If success, return the updated item
}

// Update Lost & Found Item
export async function updateLostFoundItem(id: string, updates: Partial<{
  title: string;
  description: string;
  location: string;
  date: string;
  type: 'lost' | 'found';
  image_url?: string;
}>) {
  const { data, error } = await supabase
    .from('lost_found_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
