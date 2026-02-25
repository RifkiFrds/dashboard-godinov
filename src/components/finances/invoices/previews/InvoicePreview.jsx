import React, { forwardRef } from 'react';

const getPaymentNote = (items = []) => {
    const description = items[0]?.description?.toLowerCase() || '';
    if (description.includes('termin i') || description.includes('down payment') || description.includes('dp')) {
        return 'Pembayaran ini merupakan konfirmasi untuk Termin I (Down Payment) dari total proyek.';
    }
    if (description.includes('termin ii') || description.includes('termin 2')) {
        return 'Pembayaran ini merupakan konfirmasi untuk Termin II dari total proyek.';
    }
    if (description.includes('termin iii') || description.includes('termin 3')) {
        return 'Pembayaran ini merupakan konfirmasi untuk Termin III dari total proyek.';
    }
     if (description.includes('development')) {
        return 'Pembayaran ini mengonfirmasi dimulainya tahap Development.';
    }
     if (description.includes('production')) {
        return 'Pembayaran ini merupakan pelunasan untuk tahap akhir (Production).';
    }
    return 'Terima kasih telah melakukan pembayaran.'; // Generic fallback
}

const InvoicePreview = forwardRef(({ invoice, styleConfig }, ref) => {
    const {
        id,
        client,
        clientAddress,
        projectDescription,
        items = [],
        tax = 0,
        qrUrl,
        projectId,
        company = {
            name: 'Godinov',
            logo: '/images/logo.png',
            email: 'godinov.id@gmail.com',
            address: `Kecamatan Benda, Kota Tangerang, Banten 15124`
        },
        payment = {},
        signature = {
            name: 'Muhamad Rifki Firdaus',
            title: 'Founder Godinov ID'
        }
    } = invoice || {};

    const investmentValue = items.reduce((acc, item) => acc + (item.rate * item.unit), 0);
    const totalDiscount = items.reduce((acc, item) => acc + (item.discount || 0), 0);
    const subtotal = investmentValue - totalDiscount;
    const taxAmount = subtotal * (tax / 100);
    const total = subtotal + taxAmount;
    
    const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

    return (
        <div ref={ref} className="bg-white text-gray-800 font-[sans-serif] p-8 w-[210mm] min-h-[297mm] shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h1 className="text-5xl font-bold text-gray-800 tracking-tight" style={{ color: styleConfig?.accentColor || '#111827' }}>INVOICE</h1>
                </div>
            </div>

            {/* IDs & Main Info Block */}
            <div className="flex justify-between mb-10">
                <div className="w-1/2 space-y-4">
                     <div className="flex">
                        <div className="bg-gray-100 p-3 rounded-l-lg border-r border-gray-200">
                            <p className="text-xs font-bold text-gray-500">PROJECT ID</p>
                            <p className="font-mono text-sm">{invoice.projectCode || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-r-lg">
                            <p className="text-xs font-bold text-gray-500">INVOICE NO</p>
                            <p className="font-mono text-sm">{id}</p>
                        </div>
                    </div>
                     <div>
                        <p className="font-bold text-gray-500 text-sm">TO</p>
                        <p className="font-semibold text-lg">{client}</p>
                        <p className="text-gray-600 text-sm max-w-xs">{clientAddress}</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-500 text-sm">Description</p>
                        <p className="text-gray-600 text-sm max-w-xs">{projectDescription}</p>
                    </div>
                </div>

                <div className="w-1/2 flex justify-end">
                    <div className="bg-gray-800 text-white rounded-lg p-6 w-full max-w-sm">
                        <img src={styleConfig?.logo || company.logo} alt="Company Logo" className="h-10 mb-4 invert brightness-0" />
                        <div className="text-center my-4">
                           {qrUrl && <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrUrl}`} alt="QR Code" className="mx-auto bg-white p-1 rounded"/>}
                        </div>
                        <div className="space-y-3 text-sm">
                           <div className="flex justify-between"><span className="font-semibold text-gray-400">BANK</span> <span>{payment.bank}</span></div>
                           <div className="flex justify-between"><span className="font-semibold text-gray-400">A.N</span> <span>{payment.accountName}</span></div>
                           <div className="flex justify-between"><span className="font-semibold text-gray-400">NO REK</span> <span>{payment.accountNumber}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-5">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-800 text-white" style={{ backgroundColor: styleConfig?.accentColor || '#1F2937' }}>
                            <th className="p-3 font-semibold w-2/5">PROJECT DESCRIPTION</th>
                            <th className="p-3 font-semibold text-right">RATE</th>
                            <th className="p-3 font-semibold text-right">DISCOUNT</th>
                            <th className="p-3 font-semibold text-center">UNIT</th>
                            <th className="p-3 font-semibold text-right">SUBTOTAL</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {items.map((item, index) => (
                             <tr key={index}>
                                <td className="p-3 whitespace-pre-line">{item.description}</td>
                                <td className="p-3 text-right">{formatRupiah(item.rate)}</td>
                                <td className="p-3 text-right text-red-500">{formatRupiah(-(item.discount || 0))}</td>
                                <td className="p-3 text-center">{item.unit}</td>
                                <td className="p-3 text-right font-semibold">{formatRupiah((item.rate * item.unit) - (item.discount || 0))}</td>
                            </tr>
                        ))}
                        {Array(Math.max(0, 5 - items.length)).fill(0).map((_, i) => (
                             <tr key={`empty-${i}`}><td className="p-3 h-12">&nbsp;</td><td></td><td></td><td></td><td></td></tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals and Footer */}
            <div className="flex justify-between items-start">
                <div className="text-sm text-gray-600">
                     <p className="font-bold">Terima kasih atas kepercayaan Anda.</p>
                     <p>{getPaymentNote(items)}</p>
                     <div className="mt-3 space-y-2">
                        <p><strong>EMAIL:</strong> {company.email}</p>
                        <p><strong>Alamat:</strong> {company.address}</p>
                     </div>
                </div>
                <div className="w-2/5 text-right">
                    {totalDiscount > 0 ? (
                        <div className="space-y-2">
                            <div className="flex justify-between"><span className="text-gray-600">Total Investment Value</span> <span className="font-semibold">{formatRupiah(investmentValue)}</span></div>
                            <div className="flex justify-between"><span className="text-red-500">Partnership Discount</span> <span className="font-semibold text-red-500">-{formatRupiah(totalDiscount)}</span></div>
                            <div className="flex justify-between text-xl font-bold border-t-2 border-gray-800 pt-2 mt-2" style={{ borderColor: styleConfig?.accentColor || '#1F2937' }}>
                                <span>Total Payment</span> <span style={{ color: styleConfig?.accentColor || '#1F2937' }}>{formatRupiah(total)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex justify-between"><span className="text-gray-600">SUBTOTAL</span> <span className="font-semibold">{formatRupiah(subtotal)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">TAX ({tax}%)</span> <span className="font-semibold">{formatRupiah(taxAmount)}</span></div>
                            <div className="flex justify-between text-xl font-bold border-t-2 border-gray-800 pt-2 mt-2" style={{ borderColor: styleConfig?.accentColor || '#1F2937' }}>
                                <span>TOTAL</span> <span style={{ color: styleConfig?.accentColor || '#1F2937' }}>{formatRupiah(total)}</span>
                            </div>
                        </div>
                    )}


                    <div className="mt-8 text-center">
                        <div className="inline-block">
                           <p className="font-bold border-t border-gray-400 pt-1 mt-12">{signature.name}</p>
                           <p className="text-xs text-gray-500">{signature.title}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default InvoicePreview;
