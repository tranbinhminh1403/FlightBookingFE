import { Card, Statistic } from 'antd';
import { StatisticProps } from 'antd/es/statistic/Statistic';

interface DashboardCardProps extends Partial<StatisticProps> {
  title: string;
  loading?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  prefix,
  loading = false,
  ...props
}) => {
  return (
    <Card loading={loading}>
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        {...props}
      />
    </Card>
  );
};

export default DashboardCard; 