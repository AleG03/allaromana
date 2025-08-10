# 🍝 AllaRomana

A modern, efficient group expense splitting application built with React, TypeScript, and Supabase.

## Features

- **Simple Group Management**: Create groups and invite members via shareable links
- **Smart Expense Splitting**: Add expenses and automatically calculate who owes what
- **Flexible Participants**: Split expenses among all members or just a subset
- **Real-time Sync**: Changes are instantly saved and synchronized
- **Mobile Friendly**: Responsive design that works on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase (PostgreSQL)
- **Styling**: CSS
- **Routing**: React Router v6
- **Deployment**: Vercel

## Usage

### Creating a Group
1. Visit the homepage
2. Enter a group name
3. Select your preferred language
4. Click "Create" to generate a shareable link

### Adding Members
1. Open your group
2. Add member names in the "Members" section
3. Members can be deactivated but not deleted (preserves history)

### Recording Expenses
1. Click "Add Expense"
2. Enter description and amount (supports both comma and dot decimals)
3. Select who paid and who participated
4. Save to automatically update balances

### Settling Up
The app automatically calculates:
- Each member's net balance (positive = owed money, negative = owes money)
- Optimal settlement transactions to minimize transfers
- Clear instructions on who should pay whom

## Internationalization

Currently supports:
- **Italian** (it): Default for Italian browsers
- **English** (en): Default for other locales

Language is automatically detected but can be changed per group.

## Privacy & Security

- **No user accounts required**: Groups are accessed via unique links
- **Data encryption**: All data encrypted in transit and at rest
- **Row Level Security**: Database-level access controls
- **No tracking**: No analytics or user tracking
- **GDPR compliant**: Minimal data collection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

## License

This project is licensed under the Business Source License 1.1 - see the [LICENSE](LICENSE) file for details.

**License Summary:**
- ✅ **Free for non-production use** (development, testing, personal projects)
- ✅ **Open source after 4 years** (converts to MIT License on 2029-01-01)
- ❌ **Commercial license required** for production use before Change Date
- 📧 **Contact for commercial licensing** if you plan to use this in production

## Bug Reports & Feature Requests

Please use GitHub Issues to report bugs or request features. Include:
- Steps to reproduce the issue
- Expected vs actual behavior
- Browser and device information
- Screenshots if applicable

## Acknowledgments

- Built with modern web technologies
- Inspired by the Italian tradition of "splitting the bill"
- Designed for simplicity and efficiency

---

Made with ❤️ for splitting expenses the easy way