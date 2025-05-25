# Medusa Influencer Phyllo Plugin

A comprehensive Medusa.js plugin that integrates with Phyllo's APIs to manage influencers and content creators in your e-commerce store.

## Features

- 🎯 **Creator Management**: Onboard and manage influencers through your Medusa admin
- 📊 **Analytics Dashboard**: Track creator metrics, engagement, and audience demographics
- 🔗 **Platform Integration**: Connect with YouTube, Instagram, TikTok, Twitch, and more
- ⚡ **Real-time Sync**: Automatic data synchronization from connected platforms
- 🎨 **Next.js Components**: Pre-built creator portal components
- 🔐 **Verification System**: Verify creator identities and income data
- 📈 **Campaign Management**: Manage influencer marketing campaigns and measure ROI

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ianrothfuss/medusa-influencer-phyllo.git
   cd medusa-influencer-phyllo
   ```

2. **Run setup**:
   ```bash
   ./setup.sh
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Phyllo and database credentials
   ```

5. **Build the plugin**:
   ```bash
   npm run build
   ```

## Repository Structure

- `packages/medusa-plugin/` - The core Medusa plugin
- `packages/nextjs-storefront/` - Next.js components and integration
- `examples/` - Example implementations
- `docs/` - Documentation

## Documentation

- [Installation Guide](./docs/installation.md)
- [API Reference](./docs/api-reference.md)
- [Examples](./examples/)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [GitHub Issues](https://github.com/ianrothfuss/medusa-influencer-phyllo/issues)
- [Phyllo Documentation](https://docs.getphyllo.com)
- [Medusa Documentation](https://docs.medusajs.com)
