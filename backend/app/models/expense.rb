class Expense < ApplicationRecord
    validates :date, comparison: { less_than_or_equal_to: Date.today }  # Ensure date is not in the future
    belongs_to :category
end
