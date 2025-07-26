import React, { useEffect, useState } from "react";
import "./station.css"; // 스타일 import

const ReportSummaryList = ({ stats }) => {
    return (
        <div className="report-summary-table">
        <table>
            <thead>
            <tr>
                <th>신고 유형</th>
                <th>신고 건수</th>
            </tr>
            </thead>
            <tbody>
            {stats.map((stat) => (
                <tr key={stat.codeDetailId}>
                <td>{stat.codeDetailName}</td>
                <td>{stat.count}건</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default ReportSummaryList;