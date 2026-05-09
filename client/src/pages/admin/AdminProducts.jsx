import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import { fetchProducts } from '../../redux/slices/productSlice';
import Button from '../../components/common/Button';
import ImageUploadModal from '../../components/admin/ImageUploadModal';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  useEffect(() => {
    // Fetch all products (no pagination or filters for simple admin view)
    dispatch(fetchProducts('?limit=100'));
  }, [dispatch]);

  const handleDelete = (id) => {
    // To be implemented fully - placeholder for now
    if (window.confirm('Are you sure you want to delete this product?')) {
      alert('Delete function to be connected to API');
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet/30 border-t-violet rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-white">Products</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setUploadModalOpen(true)}>Upload Image</Button>
          <Button variant="primary" icon={<HiOutlinePlus />}>Add Product</Button>
        </div>
      </div>

      <ImageUploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-sm font-medium text-gray-400">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Brand</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-center">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
              {items.map((p) => {
                const defaultVariant = p.variants?.[0] || {};
                const price = defaultVariant.price || 0;
                const stock = p.variants?.reduce((acc, v) => acc + v.stock, 0) || 0;
                const image = defaultVariant.images?.[0]?.url || 'https://via.placeholder.com/150';

                return (
                  <tr key={p._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 flex items-center gap-4">
                      <img src={image} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-white/5" />
                      <div>
                        <Link to={`/product/${p.slug}`} className="font-medium text-white hover:text-violet transition-colors line-clamp-1 max-w-[200px]">
                          {p.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">{p.variants?.length || 1} variants</p>
                      </div>
                    </td>
                    <td className="p-4 capitalize">{p.category}</td>
                    <td className="p-4">{p.brand}</td>
                    <td className="p-4 text-right font-medium text-cyan">₹{price.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${stock > 10 ? 'bg-green-500/10 text-green-500 border border-green-500/20' : stock > 0 ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-coral/10 text-coral border border-coral/20'}`}>
                        {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <button className="text-gray-400 hover:text-white transition-colors" title="Edit">
                        <HiOutlinePencilAlt size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p._id)}
                        className="text-gray-400 hover:text-coral transition-colors" 
                        title="Delete"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
