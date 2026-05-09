import { Link } from 'react-router-dom';
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from 'react-icons/hi';
import {
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Shop: [
      { label: 'All Products', path: '/products' },
      { label: 'Electronics', path: '/products?category=electronics' },
      { label: 'Fashion', path: '/products?category=fashion' },
      { label: 'Home & Living', path: '/products?category=home' },
      { label: 'Trending', path: '/products?sort=bestseller' },
    ],
    Account: [
      { label: 'My Profile', path: '/profile' },
      { label: 'My Orders', path: '/orders' },
      { label: 'Wishlist', path: '/wishlist' },
      { label: 'Cart', path: '/cart' },
    ],
    Company: [
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'FAQ', path: '/faq' },
    ],
  };

  const socialLinks = [
    { icon: FaGithub, href: '#', label: 'GitHub' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="relative mt-24 border-t border-white/5">
      {/* Gradient line on top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet to-cyan flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">N</span>
              </div>
              <span className="font-heading font-bold text-2xl gradient-text">
                NexMart
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
              Your premium AI-powered shopping destination. Discover the future
              of eCommerce with intelligent recommendations and seamless
              checkout.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <HiOutlineMail size={16} className="text-violet" />
                support@nexmart.com
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <HiOutlinePhone size={16} className="text-violet" />
                +91 98765 43210
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <HiOutlineLocationMarker size={16} className="text-violet" />
                Bengaluru, India
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-heading font-semibold text-white mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-500 hover:text-violet transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-semibold text-white text-lg">
                Subscribe to our newsletter
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Get exclusive deals, new arrivals, and AI shopping tips.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 sm:w-64 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-violet/50 transition-all"
              />
              <button className="px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet to-violet-600 text-white hover:shadow-glow transition-all duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-xs text-gray-600">
            © {currentYear} NexMart. All rights reserved. Built with 💜
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="p-2 rounded-lg text-gray-600 hover:text-violet hover:bg-white/5 transition-all duration-300"
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
